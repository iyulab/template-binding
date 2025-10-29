import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      name: 'TemplateBinding',
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? 'index.js' : `index.${format}.js`,
    },
    rollupOptions: {
      external: [
        /^lit.*/,
        /^jsonata.*/
      ]
    },
    outDir: 'dist',
    emptyOutDir: true
  },
  plugins: [
    dts({
      outDir: 'dist',
      rollupTypes: true,
      insertTypesEntry: true,
      tsconfigPath: resolve(__dirname, 'tsconfig.json')
    }) as any
  ]
})