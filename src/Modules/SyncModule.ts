import DocumentModel from "@/Models/DocumentModel"

import { SenderConfig } from "@/Protocols/SetupInputProtocol"
import { SenderContract } from "@/Protocols/SenderProtocol"

class SyncModule {
	private readonly senderConfig: SenderConfig[]

	constructor (senderConfig: SenderConfig[]) {
		this.senderConfig = senderConfig
	}

	async sync (documents: DocumentModel[]): Promise<void> {
		await Promise.all(
			documents.map(async document => await this.sender.sendToKindle(document))
		)
	}

	private get sender (): SenderContract {
		return {} as any
	}
}

export default SyncModule
