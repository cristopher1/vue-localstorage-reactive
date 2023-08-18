import { defineConfig } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'

export default defineConfig({
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs',
    },
    {
      file: 'dist/index.min.cjs',
      format: 'cjs',
      plugins: [terser()],
    },
    {
      file: 'dist/index.mjs',
      format: 'es',
    },
    {
      file: 'dist/index.min.mjs',
      format: 'es',
      plugins: [terser()],
    },
  ],
  external: [/node_module/],
  plugins: [nodeResolve(), babel({ babelHelpers: 'bundled' })],
})
