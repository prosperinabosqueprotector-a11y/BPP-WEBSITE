const express = require('express');
const { db } = require('../firebaseConfig');
const { collection, addDoc, getDocs } = require('firebase-admin/firestore');

const router = express.Router();

// 📌 Guardar información de flora o fauna
router.post('/add', async (req, res) => {
  try {
    const { type, name, image, description } = req.body;

    if (!type || !name || !image || !description) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    await addDoc(collection(db, type), { name, image, description });

    res.status(201).json({ message: 'Información guardada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar información', details: error.message });
  }
});

// 📌 Obtener toda la flora o fauna
router.get('/:type', async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, req.params.type));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener información', details: error.message });
  }
});

module.exports = router;
