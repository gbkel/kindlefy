import * as core from "@actions/core"

import { Config } from "@/Protocols/SetupInputProtocol"

import { NoValidSetupInputFoundException } from "@/Exceptions/SetupInputException"
import { EnabledSyncWithoutStorageConfigException } from "@/Exceptions/EnabledSyncWithoutStorageConfigException"

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

		const enabledSyncWithoutStorageConfig = config.sync?.noDuplicatedSync && !config.storages?.length

		if (enabledSyncWithoutStorageConfig) {
			throw new EnabledSyncWithoutStorageConfigException()
		}

		return config
	}

	private fetchGithubActionsConfig (): Config {
		try {
			return {
				kindle: {
					email: core.getInput("kindle_email")
				},
				senders: JSON.parse(core.getInput("sender")),
				sources: JSON.parse(core.getInput("sources")),
				storages: JSON.parse(core.getInput("storage")),
				sync: {
					noDuplicatedSync: core.getInput("no_duplicated_sync") === "true"
				}
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
				senders: JSON.parse(process.env.SENDER),
				sources: JSON.parse(process.env.SOURCES),
				storages: JSON.parse(process.env.STORAGE),
				sync: {
					noDuplicatedSync: process.env.NO_DUPLICATED_SYNC === "true"
				}
			}
		} catch {
			return null
		}
	}
}

export default SetupInputModule
