import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { defineConfig } from 'vite';

const devApiTarget = process.env.VITE_DEV_API_PROXY ?? 'http://localhost:3001';

/**
 * Hosts used by the preview environment. Keep this list explicit instead of
 * hard-coding deployment IPs in source.
 */
const allowedHosts = [
  'localhost',
  '127.0.0.1',
  '.e2b.app',
  'app.avid-aigroup.ir',
  '2.144.135.209',
];

export default defineConfig(() => ({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      // Must match the `paths` mapping in tsconfig.json.
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts,
    proxy: {
      '/api': {
        target: devApiTarget,
        changeOrigin: true,
      },
    },
  },

  preview: {
    host: '0.0.0.0',
    port: 3002,
    allowedHosts,
    proxy: {
      '/api': {
        target: devApiTarget,
        changeOrigin: true,
      },
    },
  },

  build: {
    // Source maps are intentionally disabled in the artifact; wire them to
    // the APM/Sentry upload step when that pipeline exists.
    sourcemap: false,
    chunkSizeWarningLimit: 600,
  },
}));
