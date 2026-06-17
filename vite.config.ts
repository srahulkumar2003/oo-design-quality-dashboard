import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ['chart.js', 'react-chartjs-2'],
          animation: ['framer-motion', 'gsap', 'three'],
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
});
