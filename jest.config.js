var path = require('path');
module.exports = {
  rootDir: path.resolve(__dirname, './'),
  collectCoverageFrom: [
    "<rootDir>/src/*/*.{ts,tsx}"
  ],
  setupFiles: [
    "<rootDir>/tests/setup.js"
  ],
  collectCoverage: true,
}
