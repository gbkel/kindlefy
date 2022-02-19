import { Config } from "@/Protocols/SetupInputProtocol"

class ConfigValidation {
	noValidSetupInputFound (config: Config): boolean {
		const isThereAnySourceConfig = Boolean(config.sources?.length)
		const isThereAnySenderConfig = Boolean(config.senders?.length)
		const isThereAnyKindleConfig = Boolean(config.kindle?.email)

		const isThereAnyConfigProvided = isThereAnySourceConfig || isThereAnySenderConfig || isThereAnyKindleConfig

		if (!isThereAnyConfigProvided) {
			return true
		} else {
			return false
		}
	}

	isNoDuplicatedSyncEnabledWithoutStorageConfig (config: Config): boolean {
		return config.sync?.noDuplicatedSync && !config.storages?.length
	}
}

export default new ConfigValidation()
