import { defineConfig } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'

export default defineConfig({
  input: 'src/index.js',
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/mjs/index.mjs',
      format: 'es',
      sourcemap: true,
    },
  ],
  external: [/node_module/],
  plugins: [nodeResolve(), babel({ babelHelpers: 'bundled' })],
})
