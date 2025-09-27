const express = require("express");
const { db } = require("../firebaseAuthConfig");
const { Timestamp } = require("firebase-admin/firestore");

const router = express.Router();

// 📌 Guardar puntuación en Firebase
router.post("/add", async (req, res) => {
  try {
    const { user, score } = req.body;

    if (!user || score === undefined) {
      return res.status(400).json({ error: "Usuario y puntuación son requeridos" });
    }

    await db.collection("quiz_scores").add({
      user,
      score,
      createdAt: Timestamp.now(), // ✅ Corregido para Firebase Admin SDK
    });

    res.status(201).json({ message: "✅ Puntuación guardada exitosamente en Firebase." });
  } catch (error) {
    res.status(500).json({ error: "❌ Error al guardar la puntuación", details: error.message });
  }
});

// 📌 Obtener el Top 5 de puntuaciones (✅ Corregido para Firebase Admin SDK)
router.get("/top", async (req, res) => {
  try {
    const scoresRef = db.collection("quiz_scores");
    const querySnapshot = await scoresRef.orderBy("score", "desc").limit(5).get();

    const scores = querySnapshot.docs.map((doc) => doc.data());

    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ error: "❌ Error al obtener puntuaciones", details: error.message });
  }
});

module.exports = router;
