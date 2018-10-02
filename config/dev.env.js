'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API: '"/api/"',
  // URL: '"http://localhost:8081/"'
  URL: '"http://localhost:8080/"'
})
