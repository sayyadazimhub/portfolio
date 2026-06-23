import express from 'express';
import {
    getExperience,
    getExperienceById,
    createExperience,
    updateExperience,
    deleteExperience,
} from '../controllers/experienceController.js';

const router = express.Router();

router.get('/', getExperience);
router.get('/:id', getExperienceById);
router.post('/', createExperience);
router.put('/:id', updateExperience);
router.delete('/:id', deleteExperience);

export default router;
