const express = require('express');
const router = express.Router();

// Endpoint que envía la URL de la imagen del puzzle
router.get('/puzzle-image', (req, res) => {
  console.log('Request received at /api/puzzle-image'); // Log para verificar
  const imageUrl = '/images/static-puzzle-image.jpg';
  res.json({ imageUrl });
});

module.exports = router;
