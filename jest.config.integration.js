var config = require('./jest.config')
config.testRegex = "(/__tests__/.*|(\\.|/)(spec))\\.tsx?$" //Overriding testRegex option
console.log('RUNNING INTEGRATION TESTS')
module.exports = config
