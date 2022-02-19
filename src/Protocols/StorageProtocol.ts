import { DocumentModel } from "@/Models/DocumentModel"

export type DocumentModelCreationAttributes = Omit<DocumentModel, "data">

export type DocumentModelSavedAttributes = DocumentModelCreationAttributes & {
	createdAt: Date
}

export interface StorageContract {
	retrieveOneDocumentByTitle: (documentTitle: string) => Promise<DocumentModelSavedAttributes | null>
	saveDocuments: (documents: DocumentModelCreationAttributes[]) => Promise<void>
}
