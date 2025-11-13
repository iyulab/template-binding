import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => {
        return format === 'es' ? `index.js` : `index.${format}.js`
      }
    },
    rollupOptions: {
      external: [
        /^lit.*/,
        /^jsonata.*/
      ]
    },
  },
  plugins: [
    dts({
      include: ['src/**/*'],
      rollupTypes: true,
    })
  ]
})