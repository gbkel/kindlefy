import DocumentModel from "@/Models/DocumentModel"

export interface SenderContract {
	sendToKindle: (document: DocumentModel) => Promise<void>
}
