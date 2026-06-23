import express from 'express';
import {
  getAboutMe,
  getAboutMeById,
  createAboutMe,
  updateAboutMe,
  deleteAboutMe,
} from '../controllers/aboutMeController.js';
import aboutMeUpload from '../middlewares/aboutMeUpload.js';

const router = express.Router();

router.get('/', getAboutMe);
router.get('/:id', getAboutMeById);
router.post('/', aboutMeUpload.single('profileImage'), createAboutMe);
router.put('/:id', aboutMeUpload.single('profileImage'), updateAboutMe);
router.delete('/:id', deleteAboutMe);

export default router;
