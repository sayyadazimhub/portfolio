import AboutMe from '../models/AboutMe.js';
import cloudinary from '../config/cloudinary.js';

const parseBoolean = (value) => value === true || value === 'true' || value === '1' || value === 1;

export const getAboutMe = async (req, res) => {
  try {
    const { admin } = req.query;
    const query = admin === 'true' || admin === '1' ? {} : { status: true };
    const aboutMe = await AboutMe.find(query).sort({ createdAt: -1 });
    res.status(200).json(aboutMe);
  } catch (error) {
    console.error('getAboutMe error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAboutMeById = async (req, res) => {
  try {
    const aboutMe = await AboutMe.findById(req.params.id);
    if (!aboutMe) {
      return res.status(404).json({ message: 'AboutMe not found' });
    }
    res.status(200).json(aboutMe);
  } catch (error) {
    console.error('getAboutMeById error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createAboutMe = async (req, res) => {
  try {
    const { fullName, title, bio, status } = req.body;

    let profileImage = '';
    let profileImagePublicId = '';

    if (req.file) {
      profileImage = req.file.path;
      profileImagePublicId = req.file.filename || req.file.public_id;
    }

    if (!fullName?.trim() || !title?.trim() || !bio?.trim()) {
      return res.status(400).json({ message: 'Full Name, Title, and Bio are required' });
    }

    const aboutMe = await AboutMe.create({
      fullName: fullName.trim(),
      title: title.trim(),
      bio: bio.trim(),
      profileImage,
      profileImagePublicId,
      status: parseBoolean(status),
    });

    res.status(201).json(aboutMe);
  } catch (error) {
    console.error('createAboutMe error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateAboutMe = async (req, res) => {
  try {
    const aboutMe = await AboutMe.findById(req.params.id);
    if (!aboutMe) {
      return res.status(404).json({ message: 'AboutMe not found' });
    }

    const { fullName, title, bio, status, removeImage } = req.body;

    aboutMe.fullName = fullName !== undefined ? fullName.trim() : aboutMe.fullName;
    aboutMe.title = title !== undefined ? title.trim() : aboutMe.title;
    aboutMe.bio = bio !== undefined ? bio.trim() : aboutMe.bio;
    aboutMe.status = status !== undefined ? parseBoolean(status) : aboutMe.status;

    if (req.file) {
      if (aboutMe.profileImagePublicId) {
        try {
          await cloudinary.uploader.destroy(aboutMe.profileImagePublicId);
        } catch (err) {
          console.error('Failed to destroy old profile image:', err);
        }
      }
      aboutMe.profileImage = req.file.path;
      aboutMe.profileImagePublicId = req.file.filename || req.file.public_id;
    } else if (removeImage === 'true' || removeImage === true) {
      if (aboutMe.profileImagePublicId) {
        try {
          await cloudinary.uploader.destroy(aboutMe.profileImagePublicId);
        } catch (err) {
          console.error('Failed to destroy old profile image:', err);
        }
      }
      aboutMe.profileImage = '';
      aboutMe.profileImagePublicId = '';
    }

    const updatedAboutMe = await aboutMe.save();
    res.status(200).json(updatedAboutMe);
  } catch (error) {
    console.error('updateAboutMe error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteAboutMe = async (req, res) => {
  try {
    const aboutMe = await AboutMe.findById(req.params.id);
    if (!aboutMe) {
      return res.status(404).json({ message: 'AboutMe not found' });
    }

    if (aboutMe.profileImagePublicId) {
      try {
        await cloudinary.uploader.destroy(aboutMe.profileImagePublicId);
      } catch (err) {
        console.error('Failed to destroy profile image from cloudinary:', err);
      }
    }

    await AboutMe.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'AboutMe deleted successfully' });
  } catch (error) {
    console.error('deleteAboutMe error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
