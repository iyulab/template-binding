import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { dts } from 'rollup-plugin-dts';

/** @type {import('rollup').RollupOptions} */
export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.cjs.js', // CommonJS 포맷 번들
        format: 'cjs'
      },
      {
        file: 'dist/index.es.js', // ES 모듈 포맷 번들
        format: 'es'
      }
    ],
    external: ['lit', 'jsonata'],
    plugins: [
      commonjs(),
      resolve({
        browser: true,
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        preferBuiltins: false,
      }),
      typescript({
        declaration: false,
      }),
      terser()
    ]
  },
  {
    input: 'types/index.d.ts',
    output: [
      {
        file: 'dist/index.d.ts', // 타입스크립트 타입 정의 번들
        format: 'es'
      }
    ],
    plugins: [
      dts(),
    ]
  }
]