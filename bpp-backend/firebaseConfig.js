const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// 📌 Ruta Absoluta del archivo de credenciales
const serviceAccountPath = path.join(__dirname, 'bpp-service-account.json');

// 📌 Verificar si el archivo de credenciales existe antes de cargarlo
if (!fs.existsSync(serviceAccountPath)) {
  process.exit(1);
}

// 📌 Cargar el archivo de credenciales correctamente
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://bpp-website-fa794.firebaseio.com', // 📌 Cambia esto si tu URL es diferente
  });
}

// 📌 Obtiene referencia a Firestore
const db = admin.firestore();

module.exports = { db };
