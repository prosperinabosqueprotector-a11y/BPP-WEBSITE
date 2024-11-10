# BPP-Plataforma

BPP-Plataforma es una aplicación web integral diseñada para proporcionar una experiencia de aprendizaje interactiva sobre la naturaleza, enfocándose específicamente en los ecosistemas forestales.

## Tecnologías Utilizadas

### Frontend

- React
- Material-UI
- React Router
- Tailwind CSS
- Vite

### Backend

- Express.js
- Node.js
- Jade (motor de plantillas)

## Instalación y Configuración

### Requisitos Previos

- Node.js (v14 o posterior)
- npm (v6 o posterior)

### Configuración del Frontend

1. Navegar al directorio del frontend:

   ```bash
   cd bpp-frontend
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   La aplicación frontend estará disponible en `http://localhost:5173`.

### Configuración del Backend

1. Navegar al directorio del backend:

   ```bash
   cd bpp-backend
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   El servidor backend se ejecutará en `http://localhost:3000`.

## Ejecutando Frontend y Backend Simultáneamente

Para ejecutar tanto el frontend como el backend de forma concurrente, se puede utilizar el script definido en el `package.json` raíz:

1. Desde el directorio raíz del proyecto, ejecuta:

   ```bash
   npm start
   ```

   Esto iniciará los servidores frontend y backend simultáneamente.

## Información Adicional

- El frontend está construido con React y utiliza Material-UI para el estilo de los componentes, junto con Tailwind CSS para clases de utilidad.
- El backend es una aplicación Express.js que sirve como API para el frontend.
- El proyecto utiliza una estructura de monorepo, con paquetes separados para el frontend y el backend.

Para obtener información más detallada sobre la estructura del proyecto y los scripts disponibles, revisar los archivos `package.json` respectivos en los directorios `bpp-frontend` y `bpp-backend`.
