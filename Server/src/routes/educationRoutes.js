import express from 'express';
import { getEducation } from '../controllers/educationController.js';

const router = express.Router();

router.get('/', getEducation);

export default router;
