const express = require("express");
const { db } = require("../firebaseAuthConfig");
// Necesitamos admin para usar FieldValue (timestamps, arrayUnion) si usas firebase-admin
const { admin } = require("../firebaseAuthConfig"); 

const router = express.Router();

/**
 * GET /api/posts
 * Obtener publicaciones (Soporta filtros para aprobadas/pendientes)
 */
router.get("/", async (req, res) => {
  try {
    const { status, uid } = req.query;
    let postsRef = db.collection("posts");

    // Filtros opcionales
    if (status === "approved") {
      postsRef = postsRef.where("approved", "==", true).where("public", "==", true);
    } else if (status === "pending") {
      postsRef = postsRef.where("approved", "==", false);
    }
    
    // Filtro por usuario específico
    if (uid) {
      postsRef = postsRef.where("uid", "==", uid);
    }

    // Ordenar por fecha (requiere índice en Firestore si usas where + orderBy)
    // postsRef = postsRef.orderBy("createdAt", "desc"); 

    const snapshot = await postsRef.get();

    if (snapshot.empty) {
      // Devolvemos array vacío en lugar de error 404 para no romper el front
      return res.status(200).json([]); 
    }

    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convertir Timestamp de Firebase a fecha legible si es necesario
      createdAt: doc.data().createdAt?.toDate() || new Date()
    }));

    res.status(200).json(posts);
  } catch (error) {
    console.error("❌ Error al obtener posts:", error);
    res.status(500).json({ error: "Error al obtener posts", details: error.message });
  }
});

/**
 * POST /api/posts
 * Crear una nueva publicación (Compatible con la estructura del Frontend)
 */
router.post("/", async (req, res) => {
  try {
    // Usamos los mismos nombres de variables que en el Frontend
    const { uid, userName, userPhoto, image, description, role } = req.body;

    if (!uid || !description) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Lógica de aprobación automática si es profesor
    const isProfessor = role === "profesor";

    const newPost = {
      uid,
      userName: userName || "Anónimo",
      userPhoto: userPhoto || null,
      image: image || null, // Aquí llega la URL de Cloudinary
      description,
      likes: [], // Array vacío para guardar los UIDs de quien dio like
      commentCount: 0,
      approved: isProfessor, // Si es profe, se aprueba solo
      public: isProfessor,   // Si es profe, se publica solo
      createdAt: new Date(), // O admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection("posts").add(newPost);

    res.status(201).json({ 
      message: isProfessor ? "Publicado correctamente" : "Enviado a revisión", 
      id: docRef.id, 
      ...newPost 
    });

  } catch (error) {
    console.error("❌ Error al crear post:", error);
    res.status(500).json({ error: "Error al crear post", details: error.message });
  }
});

// Ruta para dar Like (Opcional, si decidieras mover la lógica al backend)
router.post("/like/:id", async (req, res) => {
    try {
        const { uid } = req.body;
        const postId = req.params.id;
        const postRef = db.collection("posts").doc(postId);

        const doc = await postRef.get();
        if (!doc.exists) return res.status(404).json({error: "Post no encontrado"});

        const data = doc.data();
        const likes = data.likes || [];

        if (likes.includes(uid)) {
            // Quitar like
            await postRef.update({
                likes: admin.firestore.FieldValue.arrayRemove(uid)
            });
        } else {
            // Dar like
            await postRef.update({
                likes: admin.firestore.FieldValue.arrayUnion(uid)
            });
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;