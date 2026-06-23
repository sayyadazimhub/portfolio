import Achievement from '../models/Achievement.js';
import cloudinary from '../config/cloudinary.js';

const parseBoolean = (value) => value === true || value === 'true' || value === '1' || value === 1;

export const getAchievements = async (req, res) => {
  try {
    const { admin } = req.query;
    const query = admin === 'true' || admin === '1' ? {} : { status: true };
    const achievements = await Achievement.find(query).sort({ order: 1, date: -1 });
    res.status(200).json(achievements);
  } catch (error) {
    console.error('getAchievements error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAchievementById = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    res.status(200).json(achievement);
  } catch (error) {
    console.error('getAchievementById error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createAchievement = async (req, res) => {
  try {
    const { title, issuer, date, description, status, order } = req.body;

    let image = '';
    let imagePublicId = '';

    if (req.file) {
      image = req.file.path;
      imagePublicId = req.file.filename || req.file.public_id;
    }

    if (!title?.trim() || !issuer?.trim() || !date) {
      return res.status(400).json({ message: 'Title, Issuer, and Date are required' });
    }

    const achievement = await Achievement.create({
      title: title.trim(),
      issuer: issuer.trim(),
      date,
      description: description?.trim() || '',
      image,
      imagePublicId,
      status: status !== undefined ? parseBoolean(status) : true,
      order: order ? parseInt(order, 10) : 0,
    });

    res.status(201).json(achievement);
  } catch (error) {
    console.error('createAchievement error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    const { title, issuer, date, description, status, order, removeImage } = req.body;

    achievement.title = title !== undefined ? title.trim() : achievement.title;
    achievement.issuer = issuer !== undefined ? issuer.trim() : achievement.issuer;
    achievement.date = date !== undefined ? date : achievement.date;
    achievement.description = description !== undefined ? description.trim() : achievement.description;
    achievement.status = status !== undefined ? parseBoolean(status) : achievement.status;
    achievement.order = order !== undefined ? parseInt(order, 10) : achievement.order;

    if (req.file) {
      if (achievement.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(achievement.imagePublicId);
        } catch (err) {
          console.error('Failed to destroy old achievement image:', err);
        }
      }
      achievement.image = req.file.path;
      achievement.imagePublicId = req.file.filename || req.file.public_id;
    } else if (removeImage === 'true' || removeImage === true) {
      if (achievement.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(achievement.imagePublicId);
        } catch (err) {
          console.error('Failed to destroy old achievement image:', err);
        }
      }
      achievement.image = '';
      achievement.imagePublicId = '';
    }

    const updatedAchievement = await achievement.save();
    res.status(200).json(updatedAchievement);
  } catch (error) {
    console.error('updateAchievement error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    if (achievement.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(achievement.imagePublicId);
      } catch (err) {
        console.error('Failed to destroy achievement image from cloudinary:', err);
      }
    }

    await Achievement.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    console.error('deleteAchievement error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
