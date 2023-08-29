import path from 'path'
import { defineConfig } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'

const getOutputFileName = (path, name, infoExtension) => {
  return `${path}/${name}.${infoExtension.extension}`
}

// Extension Information
const CJS = {
  extension: 'js',
  format: 'cjs',
}
const MJS = {
  extension: 'mjs',
  format: 'es',
}

const INPUT_FILE = 'src/index.js'

// Unminified transpiler files
const OUTPUT_DIR = 'dist'
const OUTPUT_CJS_FILE = getOutputFileName(OUTPUT_DIR, 'index', CJS)
const OUTPUT_MJS_FILE = getOutputFileName(OUTPUT_DIR, 'index', MJS)

const BABEL_CONFIG_FILE = path.resolve('.', 'babel.config.json')

export default defineConfig({
  input: INPUT_FILE,
  output: [
    {
      file: OUTPUT_CJS_FILE,
      format: CJS.format,
      sourcemap: true,
      plugins: [
        getBabelOutputPlugin({
          configFile: BABEL_CONFIG_FILE,
          envName: 'es5',
        }),
      ],
    },
    {
      file: OUTPUT_MJS_FILE,
      format: MJS.format,
      sourcemap: true,
      plugins: [
        getBabelOutputPlugin({
          configFile: BABEL_CONFIG_FILE,
          envName: 'es6',
        }),
      ],
    },
  ],
  external: [/node_module/],
  plugins: [nodeResolve()],
})
