const express = require("express");
const { db } = require("../firebaseConfig");

const router = express.Router();

// 📌 Obtener toda la fauna o flora
router.get("/:type", async (req, res) => {
  try {
    const { type } = req.params;
    if (type !== "fauna" && type !== "flora") {
      return res.status(400).json({ error: "Tipo inválido, usa 'fauna' o 'flora'" });
    }

    const querySnapshot = await db.collection(type).get();
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(data);
  } catch (error) {
    console.error(`❌ Error al obtener ${type}:`, error);
    res.status(500).json({ error: `Error al obtener ${type}`, details: error.message });
  }
});

module.exports = router;
