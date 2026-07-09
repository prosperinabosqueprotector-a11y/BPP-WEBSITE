const express = require('express');
const { db } = require('../firebaseAuthConfig'); 

const router = express.Router();

// 📌 Obtener el banco de preguntas completo
router.get('/all', async (req, res) => {
  try {
    const quizzesRef = db.collection('quizzes');
    const snapshot = await quizzesRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'No hay preguntas en la base de datos' });
    }

    // Devolvemos todas para que el frontend elija 5 al azar
    const questions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener preguntas', details: error.message });
  }
});

module.exports = router;