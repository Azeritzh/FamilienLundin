/* eslint-disable */
export default {
	displayName: "kingdoms",
	preset: "../../jest.preset.js",
	globals: {
		"ts-jest": {
			tsconfig: "<rootDir>/tsconfig.spec.json",
		},
	},
	moduleFileExtensions: ["ts", "js", "html"],
	coverageDirectory: "../../coverage/libs/kingdoms",
	testEnvironment: "node",
}