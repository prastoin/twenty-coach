import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Served from Twenty's public-asset route, so every URL must stay relative
// and the bundle lands in public/pwa to ship with `twenty apply`.
export default defineConfig({
  root: import.meta.dirname,
  base: './',
  plugins: [react()],
  // The app package pins its own react copy (hoistingLimits), so without
  // deduping, dev pre-bundles two of them and hooks blow up.
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  build: {
    outDir: '../twenty-app/public/pwa',
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
