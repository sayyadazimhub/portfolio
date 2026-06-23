import express from 'express';
import {
    getSkills,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill,
} from '../controllers/skillController.js';
import skillUpload from '../middlewares/skillUpload.js';

const router = express.Router();

router.get('/', getSkills);
router.get('/:id', getSkillById);
router.post('/', skillUpload.single('icon'), createSkill);
router.put('/:id', skillUpload.single('icon'), updateSkill);
router.delete('/:id', deleteSkill);

export default router;
