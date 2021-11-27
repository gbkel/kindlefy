import { DocumentModel } from "@/Models/DocumentModel"

import { KindleConfig } from "@/Protocols/SetupInputProtocol"

export interface SenderContract {
	sendToKindle: (document: DocumentModel, kindleConfig: KindleConfig) => Promise<void>
}
