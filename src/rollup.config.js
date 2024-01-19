// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js', // CommonJS 포맷 번들
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js', // ES 모듈 포맷 번들
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    typescript(),
    commonjs(),
    resolve({
      browser: true,
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      preferBuiltins: false,
    }),
    terser()
  ]
};