import express from 'express';
import {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from '../controllers/certificateController.js';
import certificateUpload from '../middlewares/certificateUpload.js';

const router = express.Router();

router.get('/', getCertificates);
router.get('/:id', getCertificateById);
router.post('/', certificateUpload.single('certificateImage'), createCertificate);
router.put('/:id', certificateUpload.single('certificateImage'), updateCertificate);
router.delete('/:id', deleteCertificate);

export default router;
