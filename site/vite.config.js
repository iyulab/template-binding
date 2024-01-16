import { defineConfig } from 'vite'
import path from 'path';
import glob from 'fast-glob';

export default defineConfig({
  root: 'src',
  build: {
    outDir: path.resolve(__dirname, 'publish'),
    rollupOptions: {
      input: glob.sync(['src/**/*.html']).map(entry => path.resolve(__dirname, entry)),
    },
  },
  resolve: {
    alias: {
      '@': '/src',
      "@iyulab/template-binding": path.resolve(__dirname, '../../packages/template-binding/src')
    }
  }
});
