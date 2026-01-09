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

// 📌 Eliminar todos los rankings de todos los juegos (Solo para Profesores)
router.delete("/clear-all", async (req, res) => {
  try {
    // Usamos un WriteBatch para agrupar las operaciones de borrado
    const batch = db.batch();
    let totalDeleted = 0;

    // Recorremos cada juego permitido
    for (const gameId of ALLOWED_GAMES) {
      const collectionName = `${gameId}_scores`;
      const collectionRef = db.collection(collectionName);
      
      // Obtenemos todos los documentos de esa colección de puntajes
      const snapshot = await collectionRef.get();
      
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
        totalDeleted++;
      });
    }

    // Si no hay nada que borrar, avisamos
    if (totalDeleted === 0) {
      return res.status(200).json({ message: "No había registros para eliminar." });
    }

    // Ejecutamos el lote de borrado
    await batch.commit();

    res.status(200).json({ 
      message: `✅ Se han reiniciado todos los rankings. (${totalDeleted} registros eliminados)` 
    });

  } catch (error) {
    console.error("Error al limpiar rankings:", error);
    res.status(500).json({ 
      error: "❌ Error al limpiar los rankings", 
      details: error.message 
    });
  }
});

module.exports = router;
