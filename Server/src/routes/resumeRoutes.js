import express from 'express';
import {
  getResume,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
} from '../controllers/resumeController.js';
import resumeUpload from '../middlewares/resumeUpload.js';

const router = express.Router();

router.get('/', getResume);
router.get('/:id', getResumeById);
router.post('/', resumeUpload.single('resumePdf'), createResume);
router.put('/:id', resumeUpload.single('resumePdf'), updateResume);
router.delete('/:id', deleteResume);

export default router;
