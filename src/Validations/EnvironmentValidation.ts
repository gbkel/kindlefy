import * as core from "@actions/core"

class EnvironmentValidation {
	get isGithubActionEnvironment (): boolean {
		return Boolean(core.getInput("kindle_email"))
	}

	get isDevEnvironment (): boolean {
		return process.env.NODE_ENV === "development"
	}
}

export default new EnvironmentValidation()
