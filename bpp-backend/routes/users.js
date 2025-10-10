const sendEmail = require("../utils/sendEmail.js");
var express = require('express');
var router = express.Router();
const { db, admin } = require('../firebaseAuthConfig'); 
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');


router.get('/todos', verifyRole('profesor'), async (req, res) => {
  try {
    const snapshot = await db.collection('Usuarios').get();
    const usuarios = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      // Traer info de Firebase Auth usando uid (doc.id)
      const userAuth = await admin.auth().getUser(doc.id);
      usuarios.push({
        id: doc.id,
        ...data,
        emailVerified: userAuth.emailVerified,
      });
    }
    res.json({ usuarios });
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});


router.post("/signup", async (req, res) => {
  try {
    const { nombre, email, rol, username, user} = req.body;
    // Asignar custom claim (rol)
    await admin.auth().setCustomUserClaims(user.uid, { rol });
    await db.collection("Usuarios").doc(user.uid).set({
      nombre,
      username: username || nombre,
      rol,
      email,
      aprobado: rol === "estudiante" ? true : false,
      createdAt: new Date(),
    });
    res.json({
      mensaje: `Usuario creado con rol ${rol}`,
      uid: user.uid,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Token requerido" });
    // Verificar token recibido
    const decoded = await admin.auth().verifyIdToken(token);
    const { uid, email, email_verified } = decoded;
    // Verificar que el correo esté verificado
    if (!email_verified) {
      return res.status(403).json({ message: "email-not-verified" });
    }
    // Obtener documento del usuario en Firestore
    const userRef = db.collection("Usuarios").doc(uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ message: "user-not-exists" });
    }
    const userData = userSnap.data();
    // Si es profesor, verificar que esté aprobado
    if (userData.rol === "profesor" && !userData.aprobado) {
      return res.status(403).json({ message: "user-not-approved" });
    }
    // Todo correcto
    return res.status(200).json({
      message: "Login exitoso",
      nombre: userData.nombre,
      rol: userData.rol,
      aprobado: userData.aprobado,
    });
  } catch (err) {
    console.error("Error en /users/login:", err);
    return res.status(500).json({ message: "Error interno en login." });
  }
});


router.patch("/aprobar/:uid", verifyRole("profesor"), async (req, res) => {
  try {
    const { uid } = req.params;
    await db.collection("Usuarios").doc(uid).update({ aprobado: true });
    const userDoc = await db.collection("Usuarios").doc(uid).get();
    const userData = userDoc.data();
    const email = userData?.email;
    if (email) {
      await sendEmail({
        to: email,
        subject: "Solicitud aprobada de creación de usuario en BPP Website",
        text: `Hola ${userData?.nombre || ""}, le informamos que su solicitud para ser registrado con permisos de profesor ha sido aprobada.`,
      });
    }
    res.json({ success: true, message: "Usuario aprobado correctamente" });
  } catch (err) {
    console.error("Error al aprobar usuario:", err);
    res.status(500).json({ error: "Error al aprobar usuario" });
  }
});


router.delete("/rechazar/:uid", verifyRole("profesor"), async (req, res) => {
  try {
    const { uid } = req.params;

    // 1. Obtener el email del usuario
    const userDoc = await db.collection("Usuarios").doc(uid).get();
    const userData = userDoc.data();
    const email = userData?.email;

    // 2. Eliminar del Firestore
    await db.collection("Usuarios").doc(uid).delete();

    // 3. Eliminar del Auth
    await admin.auth().deleteUser(uid);

    // 4. (Opcional) Enviar correo de notificación
    if (email) {
      await sendEmail({
        to: email,
        subject: "Solicitud rechazada de creación de usuario en BPP Website",
        text: `Hola ${userData?.nombre || ""}, lamentamos informarte que tu solicitud para ser registrado con permisos de profesor ha sido rechazada.`,
      });
    }

    res.json({ success: true, message: "Usuario rechazado y eliminado" });
  } catch (err) {
    console.error("Error al rechazar usuario:", err);
    res.status(500).json({ error: "Error al rechazar usuario" });
  }
});

module.exports = router;
