const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

delete process.env.GOOGLE_APPLICATION_CREDENTIALS;

const serviceAccountPath = path.join(__dirname, 'bpp-service-account-firebase.json');
console.log("Ruta de credenciales:", serviceAccountPath);


if (!fs.existsSync(serviceAccountPath)) {
  console.error("Archivo de credenciales no encontrado");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id,
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  });
}

// Obtiene referencia a Firestore
const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, admin, auth };
