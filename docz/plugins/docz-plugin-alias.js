const { join } = require('path');
const { createPlugin } = require('docz-core');
const glob = require('fast-glob');

const camelCase = name =>
  name
    .replace(/^-ms-/, 'ms-')
    .replace(/-([a-z]|[0-9])/gi, (_, letter) => String(letter).toUpperCase())
    .replace(/^.+?/, a => String(a).toUpperCase());

const alias = () =>
  createPlugin({
    onCreateWebpackChain:  config => {
      const cwd = join(__dirname, '../../src/');
      const p = ['!**/es/**', '!**/lib/**', '**/*.{ts,tsx}', '!**/node_modules', '!**/doczrc.js'];
      const list =  glob.sync(p, { cwd });
      list.forEach(item => {
        const array = item.split('/');
        const lastName = array[array.length - 1];
        const preName = array[array.length - 2] || '';
        let name = '';
        if (/^index\.(ts|tsx)$/.test(lastName)) {
          name = array.slice(0, -1).join('/');
        } else if (camelCase(preName) === lastName.replace(/\.(ts|tsx)$/, '')) {
          name = array.slice(0, -1).join('/');
        } else {
          name = item.replace(/\.(ts|tsx)$/, '');
        }
        config.resolve.alias.set(`@${name}`, join(__dirname, '../../src', item));
      });
    },
  });

module.exports = alias;
