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
          name: "Oso de anteojos",
          image: "https://res.cloudinary.com/dbiarx9tr/image/upload/v1739164642/avm1i2kjglzwwyn405bn.jpg",
          description: "El único oso de Sudamérica, habita en los bosques andinos. Se caracteriza por sus manchas claras alrededor de los ojos, que le dan su nombre. Es un animal solitario y omnívoro, crucial para la dispersión de semillas en su ecosistema."
        },
        {
          name: "Tigrillo",
          image: "https://res.cloudinary.com/dbiarx9tr/image/upload/v1739164716/f04sj7eshyol7dlxvmmc.jpg",
          description: "Felino pequeño y ágil, cazador nocturno que habita en diversos ecosistemas, desde bosques hasta páramos. Su pelaje manchado le proporciona camuflaje, y se alimenta principalmente de pequeños mamíferos, aves e insectos."
        },
      ],
    },
    {
      title: "Aves",
      animals: [
        {
          name: "Gallinazo Rey",
          image: "https://res.cloudinary.com/dbiarx9tr/image/upload/v1739164396/ivvtblxdhwwhgkvythpr.webp",
          description: "Ave carroñera de gran tamaño, reconocible por su cabeza y cuello desnudos de colores brillantes. Juega un papel importante en la limpieza de ecosistemas al alimentarse de animales muertos."
        },
        {
          name: "Loro Cabeza Roja",
          image: "https://res.cloudinary.com/dbiarx9tr/image/upload/v1739164589/uv4i5vzenaoyessiwxmn.jpg",
          description: "Loro de tamaño mediano con plumaje verde y una distintiva cabeza roja. Habita en bosques húmedos y se alimenta de frutas, semillas y néctar. Es conocido por su inteligencia y capacidad para imitar sonidos."
        },
        {
          name: "Viuda Enmascarada",
          image: "https://res.cloudinary.com/dbiarx9tr/image/upload/v1739164847/eyzyyxdynh7jde1dmcla.jpg",
          description: "Ave pequeña con plumaje negro y una mancha blanca en las alas, que parece un antifaz. Se alimenta de insectos y habita en zonas de vegetación densa."
        },
        {
          name: "Guala Cabecirroja",
          image: "https://res.cloudinary.com/dbiarx9tr/image/upload/v1739164929/vojt5oufqa0xktjlcjc3.jpg",
          description: "Ave de rapiña de tamaño mediano, con plumaje oscuro y cabeza y cuello rojizos. Se alimenta principalmente de carroña y pequeños vertebrados."
        },
        {
          name: " Martin Pescador",
          image: "https://res.cloudinary.com/dbiarx9tr/image/upload/v1739165194/rhcr4z5tl3xjbxhh8rm0.jpg",
          description: "Ave pequeña con un pico largo y afilado, especializada en la pesca. Su plumaje es colorido, y se zambulle en el agua para capturar peces."
        },
        {
          name: "Semillero Variable",
          image: "https://res.cloudinary.com/dbiarx9tr/image/upload/v1739165078/yqn2ussja9yyvvcdu3mp.jpg",
          description: "Ave pequeña con un pico corto y fuerte, adaptado para comer semillas. Su plumaje varía según la edad y el sexo, pero generalmente es una mezcla de tonos marrones y grises."
        },
      ],
    },
    {
      title: "Reptiles Anfibios e Insectos",
      animals: [
        {
          name: "Rana Nodriza",
          image: "https://res.cloudinary.com/dbiarx9tr/image/upload/v1739164735/uz48kotbl077lvi6txnx.jpg",
          description: "Rana de tamaño mediano con piel marrón y manchas más oscuras. Se caracteriza por cargar a sus crías en su espalda, de ahí su nombre. Habita en zonas húmedas y se alimenta de insectos."
        },
        {
          name: "Polilla",
          image: "https://res.cloudinary.com/dbiarx9tr/image/upload/v1739164793/jp3dcizzqredrmjdhqof.jpg",
          description: "Insecto volador con alas cubiertas de escamas. A menudo confundida con las mariposas, se diferencia por sus antenas y su actividad nocturna. Algunas especies son polinizadoras importantes."
        },
        {
          name: "Lagartija Cola Azul",
          image: "https://res.cloudinary.com/dbiarx9tr/image/upload/v1739165011/pbs6g9lv6eznayse21lv.jpg",
          description: "Pequeña lagartija con un cuerpo delgado y una cola larga de color azul brillante, especialmente en los juveniles. Se alimenta de insectos y arañas, y es común en jardines y zonas rocosas."
        },
        {
          name: "Abaniquillo Pardo",
          image: "https://res.cloudinary.com/dbiarx9tr/image/upload/v1739165121/huz5z5vcwp2tkhgbslk5.jpg",
          description: "Insecto díptero con alas largas y estrechas, y un cuerpo delgado de color marrón. Se alimenta de néctar y polen, y es un importante polinizador de flores."
        },
      ],
    },
  ];
  const plantCategories = [
      {
        title: "Plantas Principales",
        plants: [
          {
            name: "Frijolillo",
            image: "https://res.cloudinary.com/dbiarx9tr/image/upload/v1739162737/p1eq0x3izbciz5byqdru.jpg",
            description: "Arbusto común en zonas áridas, conocido por sus flores amarillas y frutos en forma de vaina. Importante para la fauna local y la recuperación de suelos degradados."
          },
          {
            name: "Chirriador",
            image: "https://res.cloudinary.com/dbiarx9tr/image/upload/v1739163956/vumit4fozdcrunnae73w.jpg",
            description: "Árbol de gran tamaño con flores blancas y frutos comestibles. Su madera es valiosa para la construcción y su corteza se utiliza en medicina tradicional."
          },
          {
            name: "Nem de la India",
            image: "https://res.cloudinary.com/dbiarx9tr/image/upload/v1739163930/lspxql8ulf4ltmonek16.jpg",
            description: "Árbol exótico con propiedades medicinales y repelentes de insectos. Utilizado en agroforestería y para la producción de aceite."
          },
          {
            name: "Dormilona Grande",
            image: "https://res.cloudinary.com/dbiarx9tr/image/upload/v1739163873/x5q87eds5d9kvsg4kjwn.jpg",
            description: "Planta herbácea con flores rosadas que se cierran al tacto. Conocida por sus propiedades medicinales y su capacidad para fijar el nitrógeno en el suelo."
          },
          {
            name: "Maracuya Silvestre",
            image: "https://res.cloudinary.com/dbiarx9tr/image/upload/v1739163822/pphyd5worhcgctfswk4y.jpg",
            description: "Enredadera nativa con frutos comestibles y flores vistosas. Atrae polinizadores y es importante para la dieta de aves y mamíferos."
          },
          {
            name: "Coralillo",
            image: "https://res.cloudinary.com/dbiarx9tr/image/upload/v1739163783/dewowmhub8m1lqw2ys9p.jpg",
            description: "Planta arbustiva con flores rojas en forma de coral. Utilizada en cercas vivas y como ornamental. Sus frutos son tóxicos para el consumo humano."
          },
          {
            name: "Ceibo",
            image: "https://res.cloudinary.com/dbiarx9tr/image/upload/v1739163846/bk35cyihbmghvlekm53i.jpg",
            description: "Árbol emblemático de la región, con flores rojas y frutos algodonosos. Su madera es blanda y se utiliza para artesanías. Atrae colibríes y es símbolo de identidad local."
          },
        ],
      },
      {
        title: "Plantas Tóxicas",
        plants: [
          {
            name: "Rosa Amarilla",
            image: "https://res.cloudinary.com/dbiarx9tr/image/upload/v1739163989/ftvli0ljrmdr1wqjyowy.jpg",
            description: "Planta ornamental con espinas y flores amarillas. Sus frutos son tóxicos y pueden causar irritación en la piel y problemas gastrointestinales si se ingieren."
          },
          {
            name: "Amancae del Norte",
            image: "https://res.cloudinary.com/dbiarx9tr/image/upload/v1739164007/x4myrllu1xkc3wy3bhfb.jpg",
            description: "Planta herbácea con flores blancas y frutos venenosos. Utilizada en medicina tradicional, pero su uso requiere precaución debido a su toxicidad."
          },
          {
            name: "Teca Asiatico",
            image: "https://res.cloudinary.com/dbiarx9tr/image/upload/v1739164032/qktpqv5ieh1drelbtbva.jpg",
            description: "Árbol maderable con hojas grandes y flores blancas. Su madera es resistente a plagas, pero su aserrín puede causar irritación en la piel y las vías respiratorias."
          },
          {
            name: "Guacimo",
            image: "https://res.cloudinary.com/dbiarx9tr/image/upload/v1739164056/ypwyir93vqukyttithqm.jpg",
            description: "Árbol con frutos comestibles y flores amarillas. Su madera se utiliza para leña y construcciones rústicas. Contiene compuestos tóxicos que pueden causar malestar estomacal si se consumen en grandes cantidades."
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
