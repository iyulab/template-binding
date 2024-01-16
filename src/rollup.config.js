// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts', // 입력 파일
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
    commonjs({
      // CommonJS 플러그인 설정
      include: 'node_modules/**', // 변환을 적용할 모듈 경로
    }),
    resolve({
      // Node Resolve 플러그인 설정
      browser: true, // 브라우저 환경에 맞는 모듈 사용을 위해 필요한 경우 설정
      extensions: ['.js', '.jsx', '.ts', '.tsx'], // 해석할 파일 확장자
      preferBuiltins: false, // Node.js 내장 모듈을 사용하지 않도록 설정
    }),
    terser() // 코드 난독화 플러그인
  ]
};