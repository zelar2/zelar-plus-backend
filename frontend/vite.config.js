// ZELAR+ — Config do Vite para desenvolvimento do frontend
// (a build de produção usada pelo Capacitor fica na raiz do projeto)

import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: resolve(__dirname, 'cliente/app'),
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true
  }
});