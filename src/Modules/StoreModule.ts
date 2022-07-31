import { DocumentModel } from "@/Models/DocumentModel"

import { StorageConfig, SyncConfig } from "@/Protocols/SetupInputProtocol"
import { DocumentModelCreationAttributes, StorageContract } from "@/Protocols/StorageProtocol"

import LocalStorageTool from "@/Tools/Storages/LocalStorageTool"

class StoreModule {
	private readonly storageConfig: StorageConfig[]
	private readonly syncConfig: SyncConfig
	private documentsToSync: DocumentModel[] = []

	constructor (storageConfig: StorageConfig[], syncConfig: SyncConfig) {
		this.storageConfig = storageConfig
		this.syncConfig = syncConfig
	}

	async markDocumentSync (document: DocumentModel): Promise<void> {
		if (this.isAbleToUseStorage) {
			this.documentsToSync.push(document)
		}
	}

	async isDocumentAlreadySync (document: DocumentModel): Promise<boolean> {
		if (this.isAbleToUseStorage) {
			const existingDocument = await this.storage.retrieveOneDocumentByTitle(document.title)

			return Boolean(existingDocument)
		} else {
			return false
		}
	}

	async commitDocumentSyncChanges (): Promise<void> {
		const isThereAnyChangedDocument = Boolean(this.documentsToSync.length)

		if (this.isAbleToUseStorage && isThereAnyChangedDocument) {
			const formattedDocuments: DocumentModelCreationAttributes[] = this.documentsToSync.map(document => ({
				filename: document.filename,
				title: document.title,
				contentType: document.contentType
			}))

			await this.storage.saveDocuments(formattedDocuments)

			this.documentsToSync = []
		}
	}

	private get storage (): StorageContract {
		const [config] = this.storageConfig

		const storageMap: Record<StorageConfig["type"], StorageContract> = {
			local: new LocalStorageTool(config)
		}

		return storageMap[config.type]
	}

	private get isAbleToUseStorage (): boolean {
		return this.syncConfig?.noDuplicatedSync
	}
}

export default StoreModule
