export class EnabledNoDuplicatedSyncWithoutStorageConfigException extends Error {
	constructor () {
		super("Since 'no_sync_duplication' is enabled, you have to add at least one storage config to use this feature.")
	}
}
