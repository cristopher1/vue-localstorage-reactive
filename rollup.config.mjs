import { defineConfig } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'

export default defineConfig({
  input: 'src/index.js',
  output: [
    {
      file: 'dist/cjs/index.cjs',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/cjs/index.min.cjs',
      format: 'cjs',
      sourcemap: true,
      plugins: [terser()],
    },
    {
      file: 'dist/mjs/index.mjs',
      format: 'es',
      sourcemap: true,
    },
    {
      file: 'dist/mjs/index.min.mjs',
      format: 'es',
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  external: [/node_module/],
  plugins: [nodeResolve(), babel({ babelHelpers: 'bundled' })],
})
