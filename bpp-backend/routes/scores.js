const express = require("express");
const { db } = require("../firebaseAuthConfig");
const { Timestamp } = require("firebase-admin/firestore");

const router = express.Router();

const ALLOWED_GAMES = ['quiz', 'puzzle', 'memory', 'differences', 'hangman', 'wordsearch', 'crossword'];

router.post("/add", async (req, res) => {
  try {
    const { user, score, gameId } = req.body;

    if (!user || score === undefined || !gameId) {
      return res.status(400).json({ error: "Faltan datos: user, score o gameId" });
    }

    if (!ALLOWED_GAMES.includes(gameId)) {
        return res.status(400).json({ error: "ID de juego no válido" });
    }

    const collectionName = `${gameId}_scores`;

    await db.collection(collectionName).add({
      user,
      score: Number(score), 
      createdAt: Timestamp.now(),
    });

    res.status(201).json({ message: `✅ Puntuación guardada en ${collectionName}` });
  } catch (error) {
    res.status(500).json({ error: "❌ Error al guardar puntuación", details: error.message });
  }
});

// 📌 Obtener Top 5 (Dinámico)
router.get("/top", async (req, res) => {
  try {
    const { gameId } = req.query;

    if (!gameId || !ALLOWED_GAMES.includes(gameId)) {
        return res.status(400).json({ error: "Debes especificar un gameId válido" });
    }

    const collectionName = `${gameId}_scores`;
    const scoresRef = db.collection(collectionName);
    
    const querySnapshot = await scoresRef.orderBy("score", "desc").limit(5).get();

    const scores = querySnapshot.docs.map((doc) => doc.data());

    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ error: "❌ Error al obtener puntuaciones", details: error.message });
  }
});

module.exports = router;