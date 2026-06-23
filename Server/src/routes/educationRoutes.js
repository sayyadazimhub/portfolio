import express from 'express';
import {
    getEducation,
    getEducationById,
    createEducation,
    updateEducation,
    deleteEducation,
} from '../controllers/educationController.js';

const router = express.Router();

router.get('/', getEducation);
router.get('/:id', getEducationById);
router.post('/', createEducation);
router.put('/:id', updateEducation);
router.delete('/:id', deleteEducation);

export default router;
