import express from 'express';
import {
  getAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from '../controllers/achievementController.js';
import achievementUpload from '../middlewares/achievementUpload.js';

const router = express.Router();

router.get('/', getAchievements);
router.get('/:id', getAchievementById);
router.post('/', achievementUpload.single('image'), createAchievement);
router.put('/:id', achievementUpload.single('image'), updateAchievement);
router.delete('/:id', deleteAchievement);

export default router;
