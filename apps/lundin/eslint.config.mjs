import nx from "@nx/eslint-plugin"
import baseConfig from "../../eslint.config.mjs"

export default [
	...baseConfig,
	...nx.configs["flat/angular"],
	...nx.configs["flat/angular-template"],
	{
		files: ["**/*.ts"],
		rules: {
			"@angular-eslint/directive-selector": [
				"error",
				{
					type: "attribute",
					prefix: "lundin",
					style: "camelCase",
				},
			],
			"@angular-eslint/component-selector": [
				"error",
				{
					type: "element",
					prefix: "lundin",
					style: "kebab-case",
				},
			],
			"@angular-eslint/prefer-standalone": false,
		},
	},
	{
		files: ["**/*.html"],
		// Override or add rules here
		rules: {},
	},
]
