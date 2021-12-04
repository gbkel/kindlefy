import nodeMailer, { Transporter, SentMessageInfo } from "nodemailer"

import { DocumentModel } from "@/Models/DocumentModel"

import { SenderContract } from "@/Protocols/SenderProtocol"
import { SMTPConfig, CustomTransportOptions } from "@/Protocols/SMTPSenderProtocol"
import { KindleConfig } from "@/Protocols/SetupInputProtocol"

import FileUtil from "@/Utils/FileUtil"

class SMTPSenderTool implements SenderContract {
	private readonly config: SMTPConfig
	private readonly mailer: Transporter<SentMessageInfo>

	constructor (config: SMTPConfig, customTransportOptions?: CustomTransportOptions) {
		const transportConfig = {
			port: config.port,
			host: config.host,
			auth: {
				user: config.user,
				pass: config.password
			},
			...(customTransportOptions || {})
		}

		this.mailer = nodeMailer.createTransport(transportConfig)

		this.config = config
	}

	async sendToKindle (document: DocumentModel, kindleConfig: KindleConfig): Promise<void> {
		const fileMimetype = FileUtil.getMimetypeByFileName(document.filename)

		await this.mailer.sendMail({
			from: this.config.email,
			to: kindleConfig.email,
			subject: `Kindlefy - ${document.title}`,
			text: document.title,
			attachments: [
				{
					filename: document.filename,
					content: document.data,
					contentType: fileMimetype
				}
			]
		})
	}
}

export default SMTPSenderTool
