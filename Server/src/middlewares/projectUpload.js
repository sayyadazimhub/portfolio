import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Portfolio/projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const projectUpload = multer({ storage }).fields([
  { name: 'desktopImage', maxCount: 1 },
  { name: 'mobileImage', maxCount: 1 },
  { name: 'clientLogo', maxCount: 1 }
]);

export default projectUpload;
