import Resume from '../models/Resume.js';
import cloudinary from '../config/cloudinary.js';

const parseBoolean = (value) => value === true || value === 'true' || value === '1' || value === 1;

export const getResume = async (req, res) => {
  try {
    const { admin } = req.query;
    const query = admin === 'true' || admin === '1' ? {} : { status: true };
    const resume = await Resume.find(query).sort({ createdAt: -1 });
    res.status(200).json(resume);
  } catch (error) {
    console.error('getResume error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.status(200).json(resume);
  } catch (error) {
    console.error('getResumeById error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createResume = async (req, res) => {
  try {
    const { title, status } = req.body;

    let resumeUrl = '';
    let resumePublicId = '';

    if (req.file) {
      resumeUrl = req.file.path;
      resumePublicId = req.file.filename || req.file.public_id;
    }

    if (!resumeUrl || !resumePublicId) {
      return res.status(400).json({ message: 'Resume PDF is required' });
    }

    const resume = await Resume.create({
      title: title?.trim() || 'Resume',
      resumeUrl: resumeUrl,
      resumePublicId: resumePublicId,
      status: parseBoolean(status),
    });

    res.status(201).json(resume);
  } catch (error) {
    console.error('createResume error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const { title, status } = req.body;

    resume.title = title !== undefined ? title.trim() : resume.title;
    resume.status = status !== undefined ? parseBoolean(status) : resume.status;

    if (req.file) {
      if (resume.resumePublicId) {
        try {
          await cloudinary.uploader.destroy(resume.resumePublicId, { resource_type: 'raw' });
        } catch (err) {
          console.error('Failed to destroy old resume:', err);
        }
      }
      resume.resumeUrl = req.file.path;
      resume.resumePublicId = req.file.filename || req.file.public_id;
    }

    const updatedResume = await resume.save();
    res.status(200).json(updatedResume);
  } catch (error) {
    console.error('updateResume error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (resume.resumePublicId) {
      try {
        await cloudinary.uploader.destroy(resume.resumePublicId, { resource_type: 'raw' });
      } catch (err) {
        console.error('Failed to destroy resume from cloudinary:', err);
      }
    }

    await Resume.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('deleteResume error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
