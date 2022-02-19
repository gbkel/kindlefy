import { StorageContract, SavedDocumentModel } from "@/Protocols/StorageProtocol"

class LocalStorageTool implements StorageContract {
	async retrieveOneDocumentByTitle (documentTitle: string): Promise<SavedDocumentModel> {
		return null
	}

	async saveDocument (document: SavedDocumentModel): Promise<void> {}
}

export default LocalStorageTool
