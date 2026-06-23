import express from 'express';
import { getTestimonials, getTestimonialById, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonialController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.get('/', getTestimonials);
router.get('/:id', getTestimonialById);
router.post('/', upload.single('image'), createTestimonial);
router.put('/:id', upload.single('image'), updateTestimonial);
router.delete('/:id', deleteTestimonial);

export default router;
