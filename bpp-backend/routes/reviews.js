const express = require("express");
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const { db } = require("../firebaseAuthConfig");

const router = express.Router();

// Obtener reviews
// ?status=pending | approved → si no se pasa, devuelve todas
router.get("/", async (req, res) => {
  try {
    const status = req.query.status; 
    let collectionName = "reviews"; // default
    if (status === "pending") collectionName = "reviews_pendientes";
    else if (status === "approved") collectionName = "reviews_aprobadas";

    const snapshot = await db.collection(collectionName).get();

    if (snapshot.empty) return res.status(404).json({ error: "No hay reseñas disponibles" });

    const reviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(reviews);
  } catch (error) {
    console.error("❌ Error al obtener reseñas:", error);
    res.status(500).json({ error: "Error al obtener reseñas", details: error.message });
  }
});

// Añadir review pendiente (usuario autenticado, rol estudiante)
router.post("/add-pending", verifyToken, async (req, res) => {
  try {
    const { comment, rating, date } = req.body;
    if (!comment || !rating || !date) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const newReview = {
      comment,
      rating,
      date,
      user: {
        uid: req.user.uid,
        email: req.user.email,
        displayName: req.user.name || req.user.name || null, // depende de cómo lo guardes en claims
        rol: req.user.rol || "estudiante",
      },
      approved: false,
    };

    const docRef = await db.collection("reviews_pendientes").add(newReview);
    res.status(201).json({ message: "Reseña enviada a pendientes", id: docRef.id });
  } catch (error) {
    console.error("❌ Error al agregar review pendiente:", error);
    res.status(500).json({ error: "Error al agregar review pendiente", details: error.message });
  }
});

// Añadir directamente a aprobadas (solo profesores)
router.post("/add-approved", verifyRole("profesor"), async (req, res) => {
  try {
    const { comment, rating, date } = req.body;
    if (!comment || !rating || !date) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const newReview = {
      comment,
      rating,
      date,
      user: {
        uid: req.user.uid,
        email: req.user.email,
        displayName: req.user.name || null,
        rol: req.user.rol || "profesor",
      },
      approved: true,
    };

    const docRef = await db.collection("reviews_aprobadas").add(newReview);
    res.status(201).json({ message: "Reseña agregada y aprobada", id: docRef.id });
  } catch (error) {
    console.error("❌ Error al agregar review aprobada:", error);
    res.status(500).json({ error: "Error al agregar review aprobada", details: error.message });
  }
});

// Aprobar review (mover de pendientes a aprobadas)
router.post("/approve/:id", verifyRole("profesor"), async (req, res) => {
  try {
    const reviewId = req.params.id;
    const pendingRef = db.collection("reviews_pendientes").doc(reviewId);
    const docSnap = await pendingRef.get();

    if (!docSnap.exists) return res.status(404).json({ error: "Reseña pendiente no encontrada" });

    const reviewData = docSnap.data();
    reviewData.approved = true;

    await db.collection("reviews_aprobadas").doc(reviewId).set(reviewData);
    await pendingRef.delete();

    res.status(200).json({ message: "Reseña aprobada correctamente" });
  } catch (error) {
    console.error("❌ Error al aprobar review:", error);
    res.status(500).json({ error: "Error al aprobar review", details: error.message });
  }
});

// Eliminar review (pendiente o aprobada) - profesores
router.delete("/delete/:status/:id", verifyRole("profesor"), async (req, res) => {
  try {
    const { status, id } = req.params;
    const collectionName = status === "approved" ? "reviews_aprobadas" : "reviews_pendientes";

    await db.collection(collectionName).doc(id).delete();
    res.status(200).json({ message: "Reseña eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar reseña:", error);
    res.status(500).json({ error: "Error al eliminar reseña", details: error.message });
  }
});

module.exports = router;