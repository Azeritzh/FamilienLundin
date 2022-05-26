const { getJestProjects } = require("@nrwl/jest")

export default {
	projects: [
		...getJestProjects(),
		"<rootDir>/apps/lundin",
		"<rootDir>/apps/api",
		"<rootDir>/libs/api-interfaces",
		"<rootDir>/libs/age",
		"<rootDir>/libs/noughts-and-crosses",
		"<rootDir>/libs/virus",
		"<rootDir>/libs/utility",
		"<rootDir>/libs/minestryger",
		"<rootDir>/libs/meld",
		"<rootDir>/libs/agentia",
		"<rootDir>/libs/kingdoms",
	],
}
