const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dpczd4ufe',
  upload_preset: 'ml_default', 
  api_key: '8xwyN40RmNIkmwKFg6Nf6opx-dk', 
  
});

// Configure upload preset to be unsigned in Cloudinary dashboard
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';
const CLOUDINARY_CLOUD_NAME = 'dpczd4ufe';

module.exports = {
  cloudinary,
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_CLOUD_NAME,
};