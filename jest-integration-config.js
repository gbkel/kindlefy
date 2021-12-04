const config = require("./jest.config")

config.testMatch = [
	"**/*.integration.test.ts"
]

module.exports = config
