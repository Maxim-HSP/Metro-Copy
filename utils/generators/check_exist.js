/**
 * componentExists
 *
 * Check whether the given component exist in either the components or pages directory
 */

const fs = require('fs');
const path = require('path');

const appComponents = fs.readdirSync(path.join(__dirname, '../../src/'));
const doczComponents = fs.readdirSync(path.join(__dirname, '../../docs/'));

const components = appComponents.concat(doczComponents);

function componentExists(comp) {
  return components.indexOf(comp) >= 0;
}

module.exports = componentExists;
