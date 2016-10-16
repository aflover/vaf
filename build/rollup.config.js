const buble = require('rollup-plugin-buble')
const version = process.env.VERSION || require('../package.json').version

module.exports = {
  entry: 'src/index.js',
  dest: 'dist/vaf.js',
  format: 'umd',
  moduleName: 'Vaf',
  plugins: [buble()],
  banner:
`/**
 * Vaf v${version}
 * (c) ${new Date().getFullYear()} jetiny
 * @license MIT
 */`
}
