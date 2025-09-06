var express = require('express');
var router = express.Router();
const { db, admin } = require('../firebaseAuthConfig'); 
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

router.post('/solicitar', async (req, res) => {
  try {
    const { email, nombre, username, rol, password } = req.body;
    if (!email || !nombre || !username || !rol || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const solicitudRef = db.collection('RegistroPendiente').doc(email);
    const solicitudSnap = await solicitudRef.get();
    if (solicitudSnap.exists) {
      return res.status(400).json({ error: 'Ya existe una solicitud para este email' });
    }

    await solicitudRef.set({ email, nombre, username, rol, password });
    res.json({ mensaje: 'Solicitud enviada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

router.post("/signup", async (req, res) => {
  try {
    const { nombre, email, password, rol, username } = req.body;
    console.log(rol);

    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // Crear usuario en Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: nombre,
    });

    // Asignar custom claim (rol)
    await admin.auth().setCustomUserClaims(userRecord.uid, { rol });

    // Guardar datos públicos en Firestore
    await db.collection("Usuarios").doc(userRecord.uid).set({
      nombre,
      username: username || "",
      rol,
      email,
      createdAt: new Date(),
    });

    res.json({
      mensaje: `Usuario creado con rol ${rol}`,
      uid: userRecord.uid,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/aprobar', verifyRole('profesor'), async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Falta el email' });

    const solicitudRef = db.collection('RegistroPendiente').doc(email);
    const solicitudSnap = await solicitudRef.get();
    if (!solicitudSnap.exists) return res.status(404).json({ error: 'Solicitud no encontrada' });

    const data = solicitudSnap.data();

    // Crea el usuario en Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: data.email,
      password: data.password,
      displayName: data.nombre,
    });

    await admin.auth().setCustomUserClaims(userRecord.uid, { rol: data.rol })

    // Opcional: guardar datos públicos en Firestore
    await db.collection('Usuarios').doc(userRecord.uid).set({
      nombre: data.nombre,
      username: data.username,
      rol: data.rol,
      email: data.email,
    });

    // Elimina la solicitud
    await solicitudRef.delete();

    res.json({ mensaje: `Usuario aprobado y creado con rol ${data.rol}`, uid: userRecord.uid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/rechazar', verifyRole('profesor'), async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Falta el email' });

    const solicitudRef = db.collection('RegistroPendiente').doc(email);
    const solicitudSnap = await solicitudRef.get();
    if (!solicitudSnap.exists) return res.status(404).json({ error: 'Solicitud no encontrada' });

    await solicitudRef.delete();
    res.json({ mensaje: 'Solicitud rechazada y eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/pendientes', verifyRole('profesor'), async (req, res) => {
  try {
    const snapshot = await db.collection('RegistroPendiente').get();
    if (snapshot.empty) {
      return res.json({ pendientes: [] });
    }

    const pendientes = [];
    snapshot.forEach(doc => {
      const { password, ...rest } = doc.data(); // excluye password
      pendientes.push(rest);
    });

    res.json({ pendientes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;