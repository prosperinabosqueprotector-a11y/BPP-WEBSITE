const admin = require("firebase-admin");
const serviceAccount = require("./bpp-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const animalCategories = [
  {
    title: "Mamíferos",
    animals: [
      {
        name: "Jaguar",
        image: "https://cdn.pixabay.com/photo/2018/07/31/22/08/lion-3576045_1280.jpg",
      },
    ],
  },
  {
    title: "Aves",
    animals: [
      {
        name: "Colibrí",
        image: "https://cdn.pixabay.com/photo/2017/03/13/10/25/hummingbird-2139279_1280.jpg",
      },
    ],
  },
  {
    title: "Reptiles",
    animals: [
      {
        name: "Anaconda",
        image: "https://cdn.pixabay.com/photo/2014/08/15/21/40/snake-419043_1280.jpg",
      },
      {
        name: "Caimán",
        image: "https://cdn.pixabay.com/photo/2014/01/14/18/31/nile-crocodile-245013_1280.jpg",
      },
    ],
  },
];

const plantCategories = [
  {
    title: "Plantas Principales",
    plants: [
      {
        name: "Ceibo",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Roble",
        image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      },
    ],
  },
  {
    title: "Plantas Tóxicas",
    plants: [
      {
        name: "Anturio",
        image: "https://images.unsplash.com/photo-1558694440-03ade9215d7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      },
    ],
  },
];

// 🔥 Función para poblar Firestore con fauna
const seedFauna = async () => {
  try {
    const faunaCollection = db.collection("fauna");
    for (const category of animalCategories) {
      for (const animal of category.animals) {
        await faunaCollection.add({
          name: animal.name,
          image: animal.image,
          category: category.title,
        });
      }
    }
    console.log("✅ Fauna añadida con éxito");
  } catch (error) {
    console.error("❌ Error al poblar fauna:", error);
  }
};

// 🔥 Función para poblar Firestore con flora
const seedFlora = async () => {
  try {
    const floraCollection = db.collection("flora");
    for (const category of plantCategories) {
      for (const plant of category.plants) {
        await floraCollection.add({
          name: plant.name,
          image: plant.image,
          category: category.title,
        });
      }
    }
    console.log("✅ Flora añadida con éxito");
  } catch (error) {
    console.error("❌ Error al poblar flora:", error);
  }
};

// Ejecutar las funciones de poblado
(async () => {
  await seedFauna();
  await seedFlora();
  console.log("🚀 Poblado de base de datos completado.");
})();
