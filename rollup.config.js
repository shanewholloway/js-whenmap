import rpi_jsy from 'rollup-plugin-jsy'
import rpi_terser from '@rollup/plugin-terser'

export default {
  input: [
    'code/index.js',
    'code/whenmap.jsy',
    'code/whenaiter.jsy',
  ],
  output: [
    { format: 'es', dir: 'esm/', sourcemap: true },
    { format: 'es', dir: 'esm/',
      entryFileNames: '[name].min.js',
      plugins: [rpi_terser()],
    },
  ],

  external: id => /\w+:/.test(id),
  plugins: [ rpi_jsy() ],
}
