const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join(__dirname, 'bpp-service-account-firebase.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error("Archivo de credenciales no encontrado");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://bpp-website-4d581-default-rtdb.firebaseio.com',
  });
}

// Obtiene referencia a Firestore
const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, admin, auth };
