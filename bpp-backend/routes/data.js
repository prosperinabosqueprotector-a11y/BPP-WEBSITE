const express = require("express");
const { db } = require("../firebaseAuthConfig");

const router = express.Router();

// 📌 Obtener datos de flora o fauna (incluye aprobada)
router.get("/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ["fauna", "flora", "faunaAprobada", "floraAprobada"];

    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: "Tipo inválido" });
    }

    const querySnapshot = await db.collection(type).get();
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json({
      count: data.length,
      items: data
    });
  } catch (error) {
    console.error(`❌ Error al obtener ${req.params.type}:`, error);
    res.status(500).json({ error: `Error al obtener ${req.params.type}`, details: error.message });
  }
});

module.exports = router;
