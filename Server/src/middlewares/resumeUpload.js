import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Portfolio/resumes',
    allowed_formats: ['pdf'],
    resource_type: 'raw', // Support raw PDF files
  },
});

const uploadResume = multer({ storage });

export default uploadResume;
