import { defineConfig } from 'vite';
import path from 'path';


export default defineConfig({
  resolve: {
    alias: {
      '@': '/src', // src 폴더를 '@'로 시작하는 alias로 설정
      "@iyulab/template-binding": path.resolve(__dirname, '../../packages/template-binding/src')
    }
  }
});
