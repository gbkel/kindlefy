import { DocumentModel } from "@/Models/DocumentModel"

export type SavedDocumentModel = Omit<DocumentModel, "data">

export interface StorageContract {
	retrieveOneDocumentByTitle: (documentTitle: string) => Promise<SavedDocumentModel>
	saveDocument: (document: SavedDocumentModel) => Promise<void>
}
