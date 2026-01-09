const express = require('express');
const router = express.Router();
const { db } = require("../firebaseAuthConfig"); // Asegúrate de que la ruta sea correcta

router.get('/puzzle-image', async (req, res) => {
  try {
    const lastImage = req.query.last;

    // 1. Obtenemos los documentos de ambas colecciones en paralelo
    const [floraSnap, faunaSnap] = await Promise.all([
      db.collection('floraAprobada').get(),
      db.collection('faunaAprobada').get()
    ]);

    // 2. Extraemos solo las URLs de las imágenes
    let allImages = [];
    floraSnap.forEach(doc => {
      const data = doc.data();
      if (data.image) allImages.push(data.image);
    });
    faunaSnap.forEach(doc => {
      const data = doc.data();
      if (data.image) allImages.push(data.image);
    });

    // 3. Si por alguna razón las colecciones están vacías, usamos fallbacks
    if (allImages.length === 0) {
      return res.json({ 
        imageUrl: 'https://placehold.co/600x600?text=Sube+fotos+a+la+enciclopedia' 
      });
    }

    // 4. Filtramos para no repetir la imagen anterior
    let availableImages = allImages;
    if (lastImage && allImages.length > 1) {
      availableImages = allImages.filter(img => img !== lastImage);
    }

    // 5. Elegimos una al azar
    const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];
    
    res.json({ imageUrl: randomImage });
  } catch (error) {
    console.error("Error al obtener imagen para el puzzle:", error);
    res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
});

module.exports = router;