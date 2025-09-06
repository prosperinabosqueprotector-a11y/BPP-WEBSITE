const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dbiarx9tr',  
    api_key: '192948425558222',      
    api_secret: '8xwyN40RmNIkmwKFg6Nf6opx-dk' 
  });


const CLOUDINARY_UPLOAD_PRESET = 'images';
module.exports = {
  cloudinary,
  CLOUDINARY_UPLOAD_PRESET
};