var config = require('./jest.config')
config.testRegex = "(/__tests__/.*|(\\.|/)(test))\\.tsx?$" //Overriding testRegex option
console.log('RUNNING UNIT TESTS')
module.exports = config
