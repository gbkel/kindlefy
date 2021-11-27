import { DocumentModel } from "@/Models/DocumentModel"

import { KindleConfig, SenderConfig } from "@/Protocols/SetupInputProtocol"
import { SenderContract } from "@/Protocols/SenderProtocol"
import { SMTPConfig } from "@/Protocols/SMTPSenderProtocol"

import SMTPSenderService from "@/Services/SMTPSenderService"
import GmailSenderService from "@/Services/GmailSenderService"
import OutlookSenderService from "@/Services/OutlookSenderService"

class SyncModule {
	private readonly senderConfig: SenderConfig[]
	private readonly kindleConfig: KindleConfig

	constructor (senderConfig: SenderConfig[], kindleConfig: KindleConfig) {
		this.senderConfig = senderConfig
		this.kindleConfig = kindleConfig
	}

	async sync (documents: DocumentModel[]): Promise<void> {
		await Promise.all(
			documents.map(async document => await this.sender.sendToKindle(document, this.kindleConfig))
		)
	}

	private get sender (): SenderContract {
		const [config] = this.senderConfig

		const senderMap: Record<SenderConfig["type"], SenderContract> = {
			smtp: new SMTPSenderService(config as SMTPConfig),
			gmail: new GmailSenderService(config.email, config.password),
			outlook: new OutlookSenderService(config.email, config.password)
		}

		return senderMap[config.type]
	}
}

export default SyncModule
