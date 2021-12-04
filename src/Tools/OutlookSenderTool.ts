import { DocumentModel } from "@/Models/DocumentModel"
import { SenderContract } from "@/Protocols/SenderProtocol"
import { KindleConfig } from "@/Protocols/SetupInputProtocol"

import SMTPSenderTool from "@/Tools/SMTPSenderTool"

class OutlookSenderTool implements SenderContract {
	private readonly smtpSenderTool: SMTPSenderTool

	constructor (email: string, password: string) {
		this.smtpSenderTool = new SMTPSenderTool({
			email,
			password,
			user: email
		}, {
			service: "Hotmail"
		})
	}

	async sendToKindle (document: DocumentModel, kindleConfig: KindleConfig): Promise<void> {
		return await this.smtpSenderTool.sendToKindle(document, kindleConfig)
	}
}

export default OutlookSenderTool
