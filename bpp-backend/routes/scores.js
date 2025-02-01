const express = require('express');
const { db } = require('../firebaseConfig');
const { collection, addDoc, getDocs } = require('firebase-admin/firestore');

const router = express.Router();

// 📌 Guardar una puntuación en Firestore
router.post('/save', async (req, res) => {
  try {
    const { userId, score } = req.body;

    if (!userId || score === undefined) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    await addDoc(collection(db, 'scores'), { userId, score, date: new Date() });

    res.status(201).json({ message: 'Puntuación guardada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar puntuación', details: error.message });
  }
});

// 📌 Obtener todas las puntuaciones
router.get('/all', async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'scores'));
    const scores = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener puntuaciones', details: error.message });
  }
});

module.exports = router;
