import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      allowedHosts: [
        'app.avid-aigroup.ir',
        '2.144.135.209',
        'localhost',
      ],
      hmr: process.env.DISABLE_HMR !== 'true',
      watch:
        process.env.DISABLE_HMR === 'true'
          ? null
          : {},
    },
    preview: {
      host: '0.0.0.0',
      port: 3002,
      allowedHosts: [
        'app.avid-aigroup.ir',
        '2.144.135.209',
        'localhost',
      ],
    },
  };
});
