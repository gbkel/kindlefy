import { Content, ImporterContract } from "@/Protocols/ImporterProtocol"
import { SourceConfig } from "@/Protocols/SetupInputProtocol"

import HttpService from "@/Services/HttpService"

class RSSImporterTool implements ImporterContract<Buffer> {
	private readonly httpService = new HttpService({})

	async import (sourceConfig: SourceConfig): Promise<Content<Buffer>> {
		const buffer = await this.httpService.toBuffer(sourceConfig.url)

		return {
			data: buffer,
			sourceConfig
		}
	}
}

export default new RSSImporterTool()
