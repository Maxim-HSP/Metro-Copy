const componentGenerator = require('./component/index.js')

module.exports = function generators(plop) {
  // see: https://github.com/amwmedia/plop/issues/116
  plop.setHelper('preCurly', t => `{${t}`)
  plop.setHelper('afterCurly', t => `${t}}`)

  plop.setGenerator('component', componentGenerator)
  // TODO: pages, stores ..
}
