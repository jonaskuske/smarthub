/*
 * Server entry file, patches Node's `require` using the esm package
 * so that we can use JavaScript modules instead of CommonJS only.
 */

// eslint-disable-next-line no-global-assign
require = require('esm')(module)

module.exports = require('./server')
