import path from 'path'
import { defineConfig } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'

const getOutputFile = (path, name, infoExtension) => {
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
const OUTPUT_CJS_FILE = getOutputFile(OUTPUT_DIR, 'index', CJS)
const OUTPUT_MJS_FILE = getOutputFile(OUTPUT_DIR, 'index', MJS)

// getBabelOutputPlugin configuration
const BABEL_CONFIG_FILE = path.resolve('.', 'babel.config.json')
const ENV_NAME_COMMONJS = 'commonJS'
const ENV_NAME_ES_MODULES = 'ESmodules'

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
          envName: ENV_NAME_COMMONJS,
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
          envName: ENV_NAME_ES_MODULES,
        }),
      ],
    },
  ],
  external: [/node_module/],
  plugins: [nodeResolve()],
})
