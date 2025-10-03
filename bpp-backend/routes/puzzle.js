const express = require('express');
const router = express.Router();

// Lista de imágenes disponibles
const images = [
  '/images/puzzle1.jpg',
  '/images/puzzle2.jpg',
  '/images/puzzle3.jpeg',
  '/images/puzzle4.jpeg',
  '/images/puzzle5.jpg',
];

// Endpoint que envía una imagen aleatoria
router.get('/puzzle-image', (req, res) => {
  console.log('Request received at /api/puzzle-image');
  const randomImage = images[Math.floor(Math.random() * images.length)];
  res.json({ imageUrl: randomImage });
});

module.exports = router;
