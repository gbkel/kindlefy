import { DocumentModel } from "@/Models/DocumentModel"
import { SenderContract } from "@/Protocols/SenderProtocol"
import { KindleConfig } from "@/Protocols/SetupInputProtocol"

import SMTPSenderService from "@/Services/SMTPSenderService"

class GmailSenderService implements SenderContract {
	private readonly smtpSenderService: SMTPSenderService

	constructor (email: string, password: string) {
		this.smtpSenderService = new SMTPSenderService({
			host: "smtp.gmail.com",
			email,
			password,
			user: email,
			port: 587
		}, {
			secure: false,
			tls: {
				ciphers: "SSLv3",
				rejectUnauthorized: false
			}
		})
	}

	async sendToKindle (document: DocumentModel, kindleConfig: KindleConfig): Promise<void> {
		return await this.smtpSenderService.sendToKindle(document, kindleConfig)
	}
}

export default GmailSenderService
