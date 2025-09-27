const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dsaunprcy',  
    api_key: '239523177446358',      
    api_secret: 'OQbp4K51CzQUhGGg8GPFGGLsOc0' 
  });


const CLOUDINARY_UPLOAD_PRESET = 'images';
module.exports = {
  cloudinary,
  CLOUDINARY_UPLOAD_PRESET
};