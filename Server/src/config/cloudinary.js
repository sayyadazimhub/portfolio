import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'azimcloudinary90',
  api_key: process.env.CLOUDINARY_API_KEY || '981395129368127',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'G0q4ACDbulPNbxysUebwn6ncg6Y',
});

export default cloudinary;