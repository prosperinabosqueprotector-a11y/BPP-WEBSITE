export const colorSchemes = {
  spring: {
    primary: '#7cb342',
    secondary: '#ffeb3b',
    background: '#e8f5e9',
    text: '#33691e',
  },
  summer: {
    primary: '#43a047',
    secondary: '#ffa000',
    background: '#f1f8e9',
    text: '#1b5e20',
  },
  autumn: {
    primary: '#ef6c00',
    secondary: '#795548',
    background: '#fff3e0',
    text: '#3e2723',
  },
  winter: {
    primary: '#0288d1',
    secondary: '#b3e5fc',
    background: '#e3f2fd',
    text: '#01579b',
  },
};

export const navItems = [
  { text: 'Inicio', emoji: '🏠', route: '/' },
  { text: 'Mapa', emoji: '🗺️', route: '/mapa' },
  { text: 'Flora', emoji: '🌿', route: '/flora' },
  { text: 'Fauna', emoji: '🦊', route: '/fauna' },
  { text: 'Juegos', emoji: '🎮', route: '/juegos' },
  { text: 'Comunidad', emoji: '📸', route: '/comunidad' },
];

export const learningOptions = [
  {
    title: 'Mapa del Bosque',
    image:
      'https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    icon: '🗺️',
    route: '/mapa',
  },
  {
    title: 'Descubre Plantas',
    image:
      'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    icon: '🌿',
    route: '/flora',
  },
  {
    title: 'Animales Amigos',
    image:
      'https://images.unsplash.com/photo-1546182990-dffeafbe841d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    icon: '🦊',
    route: '/fauna',
  },
  {
    title: 'Juegos del Bosque',
    image:
      'https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    icon: '🎮',
    route: '/juegos',
  },
  {
    title: 'Comunidad',
    image:
      'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    icon: '📸',
    route: '/comunidad',
  },
];

export const animalCategories = [
  {
    title: 'Mamíferos',
    animals: [
      {
        name: 'Jaguar',
        image:
          'https://cdn.pixabay.com/photo/2018/07/31/22/08/lion-3576045_1280.jpg',
      },
    ],
  },
  {
    title: 'Aves',
    animals: [
      {
        name: 'Colibrí',
        image:
          'https://cdn.pixabay.com/photo/2017/03/13/10/25/hummingbird-2139279_1280.jpg',
      },
    ],
  },
  {
    title: 'Reptiles',
    animals: [
      {
        name: 'Anaconda',
        image:
          'https://cdn.pixabay.com/photo/2014/08/15/21/40/snake-419043_1280.jpg',
      },
      {
        name: 'Caimán',
        image:
          'https://cdn.pixabay.com/photo/2014/01/14/18/31/nile-crocodile-245013_1280.jpg',
      },
    ],
  },
];

export const plantCategories = [
  {
    title: 'Plantas Principales',
    plants: [
      {
        name: 'Ceibo',
        image:
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Roble',
        image:
          'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Pino',
        image:
          'https://images.unsplash.com/photo-1518124880777-cf8c82231ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Eucalipto',
        image:
          'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Jacaranda',
        image:
          'https://images.unsplash.com/photo-1558694440-03ade9215d7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Araucaria',
        image:
          'https://images.unsplash.com/photo-1502082553048-f009c37129b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      },
    ],
  },
  {
    title: 'Plantas Toxicas',
    plants: [
      {
        name: 'Anturio',
        image:
          'https://images.unsplash.com/photo-1558694440-03ade9215d7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Adelfa',
        image:
          'https://images.unsplash.com/photo-1558694440-03ade9215d7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Cicuta',
        image:
          'https://images.unsplash.com/photo-1558694440-03ade9215d7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Belladona',
        image:
          'https://images.unsplash.com/photo-1558694440-03ade9215d7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Ricino',
        image:
          'https://images.unsplash.com/photo-1558694440-03ade9215d7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Acónito',
        image:
          'https://images.unsplash.com/photo-1558694440-03ade9215d7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      },
    ],
  },
  {
    title: 'Plantas Frutales',
    plants: [
      {
        name: 'Cocotero',
        image:
          'https://images.unsplash.com/photo-1558694440-03ade9215d7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Manzano',
        image:
          'https://images.unsplash.com/photo-1558694440-03ade9215d7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Naranjo',
        image:
          'https://images.unsplash.com/photo-1558694440-03ade9215d7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Limonero',
        image:
          'https://images.unsplash.com/photo-1558694440-03ade9215d7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Mango',
        image:
          'https://images.unsplash.com/photo-1558694440-03ade9215d7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Aguacate',
        image:
          'https://images.unsplash.com/photo-1558694440-03ade9215d7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      },
    ],
  },
];
