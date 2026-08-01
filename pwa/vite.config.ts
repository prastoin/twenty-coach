import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Served from Twenty's public-asset route, so every URL must stay relative
// and the bundle lands in public/pwa to ship with `twenty apply`.
export default defineConfig({
  root: import.meta.dirname,
  base: './',
  plugins: [react()],
  build: {
    outDir: '../public/pwa',
    emptyOutDir: true,
  },
  server: {
    proxy: Object.fromEntries(
      ['/graphql', '/metadata', '/oauth', '/.well-known'].map((path) => [
        path,
        { target: 'http://localhost:2020', changeOrigin: true },
      ]),
    ),
  },
});
