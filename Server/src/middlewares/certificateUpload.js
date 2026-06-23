import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Portfolio/certificates',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
  },
});

const certificateUpload = multer({ storage });

export default certificateUpload;
