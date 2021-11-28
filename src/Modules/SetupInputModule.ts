import * as core from "@actions/core"

import { Config } from "@/Protocols/SetupInputProtocol"

import { NoValidSetupInputFoundException } from "@/Exceptions/SetupInputException"

class SetupInputModule {
	async fetch (): Promise<Config> {
		let config: Config

		config = this.fetchGithubActionsConfig()

		if (!config) {
			config = this.fetchEnvConfig()
		}

		if (!config) {
			throw new NoValidSetupInputFoundException()
		}

		return config
	}

	private fetchGithubActionsConfig (): Config {
		try {
			return {
				kindle: {
					email: core.getInput("kindle_email")
				},
				sender: JSON.parse(core.getInput("sender")),
				sources: JSON.parse(core.getInput("sources"))
			}
		} catch {
			return null
		}
	}

	private fetchEnvConfig (): Config {
		try {
			return {
				kindle: {
					email: process.env.KINDLE_EMAIL
				},
				sender: JSON.parse(process.env.SENDER),
				sources: JSON.parse(process.env.SOURCES)
			}
		} catch {
			return null
		}
	}
}

export default SetupInputModule
