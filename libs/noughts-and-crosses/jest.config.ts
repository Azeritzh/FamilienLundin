/* eslint-disable */
export default {
	displayName: "noughts-and-crosses",
	preset: "../../jest.preset.js",
	globals: {
		"ts-jest": {
			tsconfig: "<rootDir>/tsconfig.spec.json",
		},
	},
	moduleFileExtensions: ["ts", "js", "html"],
	coverageDirectory: "../../coverage/libs/noughts-and-crosses",
	testEnvironment: "node",
}