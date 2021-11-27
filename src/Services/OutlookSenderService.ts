import { DocumentModel } from "@/Models/DocumentModel"
import { SenderContract } from "@/Protocols/SenderProtocol"
import { KindleConfig } from "@/Protocols/SetupInputProtocol"

import SMTPSenderService from "@/Services/SMTPSenderService"

class OutlookSenderService implements SenderContract {
	private readonly smtpSenderService: SMTPSenderService

	constructor (email: string, password: string) {
		this.smtpSenderService = new SMTPSenderService({
			email,
			password,
			user: email
		}, {
			service: "Hotmail"
		})
	}

	async sendToKindle (document: DocumentModel, kindleConfig: KindleConfig): Promise<void> {
		return await this.smtpSenderService.sendToKindle(document, kindleConfig)
	}
}

export default OutlookSenderService
