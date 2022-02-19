import github from "@actions/github"

class EnvironmentValidation {
	get isGithubActionEnvironment (): boolean {
		console.log(github)
		return Boolean(github?.context)
	}

	get isDevEnvironment (): boolean {
		return process.env.NODE_ENV === "development"
	}
}

export default new EnvironmentValidation()
