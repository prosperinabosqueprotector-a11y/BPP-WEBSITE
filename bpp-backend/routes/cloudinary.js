import express from 'express';
import cloudinary from './cloudinaryConfig.js';

const router = express.Router();

router.get('/images', async (req, res) => {
  try {
    const result = await cloudinary.search.expression(
      'resource_type:image'
    ).execute();
    res.status(200).json({ images: result.resources });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Error al obtener imágenes' });
  }
});

export default router;