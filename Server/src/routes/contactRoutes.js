import express from 'express';
import { getContact, submitContact, updateContact, deleteContact } from '../controllers/contactController.js';

const router = express.Router();

router.get('/', getContact);
router.post('/', submitContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

export default router;
