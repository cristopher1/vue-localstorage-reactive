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
  babelEnvName: 'buildCommonJS',
}
const MJS = {
  extension: 'mjs',
  format: 'es',
  babelEnvName: 'buildESmodules',
}

const INPUT_FILE = 'src/index.js'

// Unminified transpiler files
const OUTPUT_DIR = 'dist'
const OUTPUT_CJS_FILE = getOutputFile(OUTPUT_DIR, 'index', CJS)
const OUTPUT_MJS_FILE = getOutputFile(OUTPUT_DIR, 'index', MJS)

// getBabelOutputPlugin configuration
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
          envName: CJS.babelEnvName,
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
          envName: MJS.babelEnvName,
        }),
      ],
    },
  ],
  external: [/node_module/],
  plugins: [nodeResolve()],
})
