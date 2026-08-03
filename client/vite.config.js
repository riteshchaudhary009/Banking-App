import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    proxy: {
      '/api': 'https://banking-app-1-6jsx.onrender.com',
      '/uploads': 'https://banking-app-1-6jsx.onrender.com',
    },
  },
});
