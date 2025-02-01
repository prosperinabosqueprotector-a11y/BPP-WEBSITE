const express = require("express");
const { db } = require("../firebaseConfig");

const router = express.Router();

// 📌 Obtener todas las reseñas aprobadas
router.get("/all", async (req, res) => {
  try {
    const reviewsRef = db.collection("reviews");
    const snapshot = await reviewsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "No hay reseñas disponibles" });
    }

    const reviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(reviews);
  } catch (error) {
    console.error("❌ Error al obtener reseñas:", error);
    res.status(500).json({ error: "Error al obtener reseñas", details: error.message });
  }
});

// 📌 Agregar una nueva reseña (AHORA SE APRUEBA AUTOMÁTICAMENTE)
router.post("/add", async (req, res) => {
  try {
    const { username, comment, rating, date } = req.body;

    if (!username || !comment || !rating || !date) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // 🔥 Ahora todas las reseñas se guardan con `approved: true`
    await db.collection("reviews").add({ username, comment, rating, date, approved: true });

    res.status(201).json({ message: "Reseña agregada y aprobada automáticamente" });
  } catch (error) {
    console.error("❌ Error al agregar la reseña:", error);
    res.status(500).json({ error: "Error al agregar la reseña", details: error.message });
  }
});

// 📌 Eliminar una reseña
router.delete("/delete/:id", async (req, res) => {
  try {
    const reviewId = req.params.id;
    const reviewRef = db.collection("reviews").doc(reviewId);

    await reviewRef.delete();
    res.status(200).json({ message: "Reseña eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar reseña:", error);
    res.status(500).json({ error: "Error al eliminar reseña", details: error.message });
  }
});

module.exports = router;
