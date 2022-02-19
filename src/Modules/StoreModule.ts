import { DocumentModel } from "@/Models/DocumentModel"

import { StorageConfig, SyncConfig } from "@/Protocols/SetupInputProtocol"
import { StorageContract } from "@/Protocols/StorageProtocol"

import LocalStorageTool from "@/Tools/Storages/LocalStorageTool"

class StoreModule {
	private readonly storageConfig: StorageConfig[]
	private readonly syncConfig: SyncConfig
	private readonly documentsToSync: DocumentModel[] = []

	constructor (storageConfig: StorageConfig[], syncConfig: SyncConfig) {
		this.storageConfig = storageConfig
		this.syncConfig = syncConfig
	}

	async markDocumentSync (document: DocumentModel): Promise<void> {
		if (this.isAbleToSync) {
			this.documentsToSync.push(document)
		}
	}

	async isDocumentAlreadySync (document: DocumentModel): Promise<boolean> {
		if (this.isAbleToSync) {
			const existingDocument = await this.storage.retrieveOneDocumentByTitle(document.title)

			return Boolean(existingDocument)
		} else {
			return false
		}
	}

	async commitDocumentSyncChanges (): Promise<void> {
		if (this.isAbleToSync) {
			for (const document of this.documentsToSync) {
				await this.storage.saveDocument(document)
			}
		}
	}

	private get storage (): StorageContract {
		const [config] = this.storageConfig

		const storageMap: Record<StorageConfig["type"], StorageContract> = {
			local: new LocalStorageTool()
		}

		return storageMap[config.type]
	}

	private get isAbleToSync (): boolean {
		return this.syncConfig?.noDuplicatedSync
	}
}

export default StoreModule
