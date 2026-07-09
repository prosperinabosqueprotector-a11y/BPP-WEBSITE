const admin = require('firebase-admin');
const serviceAccount = require('./bpp-service-account.json'); // Asegúrate de tener este archivo

// Inicializa Firebase Admin SDK (verifica si ya está inicializado)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://bpp-website-fa794.firebaseio.com',
  });
}

// Obtiene referencia a Firestore
const db = admin.firestore();

// 🔥 Preguntas que queremos insertar en Firestore
const questions = [
  {
    question: '¿Cuál es el ecosistema más biodiverso del planeta?',
    options: ['Desierto', 'Selva Amazónica', 'Tundra', 'Sábana'],
    correctAnswer: 'Selva Amazónica',
  },
  {
    question: '¿Qué es la biodiversidad?',
    options: [
      'La variedad de seres vivos en un lugar',
      'La cantidad de plantas en una región',
      'El número de especies extintas',
      'Un tipo de clima tropical',
    ],
    correctAnswer: 'La variedad de seres vivos en un lugar',
  },
  {
    question: '¿Qué animales son típicos de las Islas Galápagos?',
    options: ['Pandas', 'Pingüinos y tortugas gigantes', 'Canguros', 'Leones africanos'],
    correctAnswer: 'Pingüinos y tortugas gigantes',
  },
  {
    question: '¿Qué es la deforestación?',
    options: [
      'Plantar árboles en zonas secas',
      'La tala de árboles a gran escala',
      'Proteger bosques y selvas',
      'Crear parques naturales',
    ],
    correctAnswer: 'La tala de árboles a gran escala',
  },
  {
    question: '¿Cuál es el gas más importante para el efecto invernadero?',
    options: ['Dióxido de carbono (CO₂)', 'Oxígeno (O₂)', 'Nitrógeno (N₂)', 'Helio (He)'],
    correctAnswer: 'Dióxido de carbono (CO₂)',
  },
];

// Función para insertar las preguntas en Firestore
const seedQuizData = async () => {
  try {
    const batch = db.batch(); // Usa un batch para insertar múltiples documentos rápidamente

    questions.forEach((question) => {
      const docRef = db.collection('quizzes').doc(); // Crea un documento nuevo en "quizzes"
      batch.set(docRef, question);
    });

    await batch.commit(); // Ejecuta el batch
    console.log(
      '✅ Preguntas insertadas en \
      Firestore correctamente'
    );
    process.exit(); // Termina el proceso
  } catch (error) {
    console.error('❌ Error al insertar preguntas en Firestore:', error);
    process.exit(1); // Termina el proceso con error
  }
};

// Ejecutar la función
seedQuizData();
