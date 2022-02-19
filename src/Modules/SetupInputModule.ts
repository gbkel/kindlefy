import * as core from "@actions/core"

import { Config } from "@/Protocols/SetupInputProtocol"

import { NoValidSetupInputFoundException } from "@/Exceptions/SetupInputException"
import { EnabledNoDuplicatedSyncWithoutStorageConfigException } from "@/Exceptions/EnabledNoDuplicatedSyncWithoutStorageConfigException"

import ParseUtil from "@/Utils/ParseUtil"

import EnvironmentValidation from "@/Validations/EnvironmentValidation"
import ConfigValidation from "@/Validations/ConfigValidation"

class SetupInputModule {
	async fetch (): Promise<Config> {
		let config: Config

		if (EnvironmentValidation.isGithubActionEnvironment) {
			config = this.fetchGithubActionsConfig()
		} else {
			config = this.fetchEnvConfig()
		}

		if (ConfigValidation.noValidSetupInputFound(config)) {
			throw new NoValidSetupInputFoundException()
		}

		if (ConfigValidation.isNoDuplicatedSyncEnabledWithoutStorageConfig(config)) {
			throw new EnabledNoDuplicatedSyncWithoutStorageConfigException()
		}

		return config
	}

	private fetchGithubActionsConfig (): Config {
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
	}

	private fetchEnvConfig (): Config {
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
	}
}

export default SetupInputModule
