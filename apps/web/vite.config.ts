import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
      '@core': path.resolve(__dirname, './app/core'),
      '@modules': path.resolve(__dirname, './app/modules'),
      '@shared': path.resolve(__dirname, './app/shared'),
      '@router': path.resolve(__dirname, './app/router'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: false,
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          tanstack: ['@tanstack/react-query', '@tanstack/react-table'],
          charts: ['apexcharts', 'react-apexcharts'],
        },
      },
    },
  },
});
