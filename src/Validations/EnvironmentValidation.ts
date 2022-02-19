import github from "@actions/github"

class EnvironmentValidation {
	isGithubActionEnvironment (): boolean {
		return Boolean(github?.context)
	}

	isDevEnvironment (): boolean {
		return process.env.NODE_ENV === "development"
	}
}

export default new EnvironmentValidation()
