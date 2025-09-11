const express = require("express");
const { db } = require("../firebaseAuthConfig");

const router = express.Router();

/**
 * GET /api/posts
 * Obtener todas las publicaciones
 */
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("posts").orderBy("createdAt", "desc").get();

    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(posts);
  } catch (error) {
    console.error("❌ Error al obtener posts:", error);
    res.status(500).json({ error: "Error al obtener posts", details: error.message });
  }
});

/**
 * POST /api/posts
 * Crear una nueva publicación
 */
router.post("/", async (req, res) => {
  try {
    const { userId, userName, image, description } = req.body;

    if (!userId || !userName || !description) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const newPost = {
      userId,
      userName,
      image: image || null,
      description,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("posts").add(newPost);

    res.status(201).json({ id: docRef.id, ...newPost });
  } catch (error) {
    console.error("❌ Error al crear post:", error);
    res.status(500).json({ error: "Error al crear post", details: error.message });
  }
});

module.exports = router;
