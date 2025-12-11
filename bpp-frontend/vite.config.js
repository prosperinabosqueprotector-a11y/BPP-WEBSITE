import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],           // Configura Vite para React con SWC
  server: {
    historyApiFallback: true,   // Permite rutas SPA al recargar
  },
  optimizeDeps: {
    exclude: ['pdfjs-dist'],    // Evita que Vite procese pdfjs durante el build
  },
});
