const { pathsToModuleNameMapper } = require("ts-jest/utils")
const path = require("path")

const { compilerOptions } = require("./tsconfig.json")

module.exports = {
	roots: [
		"<rootDir>/src"
	],
	moduleNameMapper: pathsToModuleNameMapper(
		compilerOptions.paths,
		{
			prefix: `${path.resolve(__dirname, ".")}/`
		}
	),
	collectCoverageFrom: [
		"<rootDir>/src/**/*.ts"
	],
	coverageDirectory: "coverage",
	testEnvironment: "node",
	transform: {
		".+\\.ts$": "ts-jest"
	},
	testTimeout: 30000
}
