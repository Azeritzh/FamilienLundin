/* eslint-disable */
export default {
	displayName: "web-gl-display",
	preset: "../../jest.preset.js",
	globals: {
		"ts-jest": {
			tsconfig: "<rootDir>/tsconfig.spec.json",
		},
	},
	moduleFileExtensions: ["ts", "js", "html"],
	coverageDirectory: "../../coverage/libs/web-gl-display",
	testEnvironment: "node",
}