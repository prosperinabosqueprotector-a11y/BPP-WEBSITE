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

router.get('/puzzle-image', (req, res) => {
  // Recibimos la última imagen que tuvo el usuario (si existe)
  const lastImage = req.query.last;
  
  // Filtramos para no repetir la inmediata anterior
  let availableImages = images;
  if (lastImage) {
    availableImages = images.filter(img => img !== lastImage);
  }

  // Si nos quedamos sin imágenes (ej. solo había 1), reseteamos
  if (availableImages.length === 0) availableImages = images;

  const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];
  res.json({ imageUrl: randomImage });
});

module.exports = router;
