import express from 'express';
import { 
    getProjects, 
    getProjectById, 
    addProject, 
    updateProject, 
    deleteProject 
} from '../controllers/projectController.js';
import projectUpload from '../middlewares/projectUpload.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', projectUpload, addProject);
router.put('/:id', projectUpload, updateProject);
router.delete('/:id', deleteProject);

export default router;
