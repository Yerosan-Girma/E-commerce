// Cloudinary configuration placeholder
// To enable file/image uploads, install and configure cloudinary:
//   npm install cloudinary
//
// Then replace this file with:
//
// import { v2 as cloudinary } from 'cloudinary';
//
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key:    process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
//
// export default cloudinary;

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
};

export default cloudinaryConfig;
