import * as core from "@actions/core"

class EnvironmentValidation {
	isGithubActionEnvironment (): boolean {
		return Boolean(core.getInput("kindle_email"))
	}
}

export default new EnvironmentValidation()
