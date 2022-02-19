import * as core from "@actions/core"

import { Config } from "@/Protocols/SetupInputProtocol"

import { NoValidSetupInputFoundException } from "@/Exceptions/SetupInputException"
import { EnabledSyncWithoutStorageConfigException } from "@/Exceptions/EnabledSyncWithoutStorageConfigException"

import ParseUtil from "@/Utils/ParseUtil"

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
				senders: ParseUtil.safelyParseArray(core.getInput("sender")),
				sources: ParseUtil.safelyParseArray(core.getInput("sources")),
				storages: ParseUtil.safelyParseArray(core.getInput("storage")),
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
				senders: ParseUtil.safelyParseArray(process.env.SENDER),
				sources: ParseUtil.safelyParseArray(process.env.SOURCES),
				storages: ParseUtil.safelyParseArray(process.env.STORAGE),
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
