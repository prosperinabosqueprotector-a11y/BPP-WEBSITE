const express = require('express');
const router = express.Router();

/* GET home page (devolviendo JSON en lugar de renderizar una vista) */
router.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API de BPP' });
});

module.exports = router;
