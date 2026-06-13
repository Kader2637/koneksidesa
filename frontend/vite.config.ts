import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'next/image': path.resolve(__dirname, './src/components/ui/Image.tsx'),
      'next/link': path.resolve(__dirname, './src/components/ui/Link.tsx'),
    },
  },
  optimizeDeps: {
    entries: ['index.html'],
  },
  server: {
    port: 3000,
  },
});
