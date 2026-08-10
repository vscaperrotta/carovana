import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import paths from './config/paths.js';

const APP_DIR = paths.appSrc;

// https://vite.dev/config/
export default defineConfig({
  server: {
    open: true,
  },
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      '@src': `${APP_DIR}`,
      '@api': `${APP_DIR}/api`,
      '@assets': `${APP_DIR}/assets`,
      '@components': `${APP_DIR}/components`,
      '@containers': `${APP_DIR}/containers`,
      '@routes': `${APP_DIR}/routes`,
      '@store': `${APP_DIR}/store`,
      '@style': `${APP_DIR}/styles`,
      '@utils': `${APP_DIR}/utils`,
    },
  },
});
