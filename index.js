require('babel-register')({
  presets: [ [ 'env', { useBuiltIns: true } ] ]
})
console.log("Hello");

module.exports = require('./entrypoint')
