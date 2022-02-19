import { DocumentModel } from "@/Models/DocumentModel"

import { KindleConfig, SenderConfig } from "@/Protocols/SetupInputProtocol"
import { SenderContract } from "@/Protocols/SenderProtocol"
import { SMTPConfig } from "@/Protocols/SMTPSenderProtocol"

import SMTPSenderTool from "@/Tools/Senders/SMTPSenderTool"
import GmailSenderTool from "@/Tools/Senders/GmailSenderTool"
import OutlookSenderTool from "@/Tools/Senders/OutlookSenderTool"

class SyncModule {
	private readonly senderConfig: SenderConfig[]
	private readonly kindleConfig: KindleConfig

	constructor (senderConfig: SenderConfig[], kindleConfig: KindleConfig) {
		this.senderConfig = senderConfig
		this.kindleConfig = kindleConfig
	}

	async sync (document: DocumentModel): Promise<void> {
		await this.sender.sendToKindle(document, this.kindleConfig)
	}

	private get sender (): SenderContract {
		const [config] = this.senderConfig

		const senderMap: Record<SenderConfig["type"], SenderContract> = {
			smtp: new SMTPSenderTool(config as SMTPConfig),
			gmail: new GmailSenderTool(config.email, config.password),
			outlook: new OutlookSenderTool(config.email, config.password)
		}

		return senderMap[config.type]
	}
}

export default SyncModule
