import { DocumentModel } from "@/Models/DocumentModel"

import { Content } from "@/Protocols/ImporterProtocol"
import { SourceConfig } from "@/Protocols/SetupInputProtocol"
import { ConverterContract } from "@/Protocols/ConverterProtocol"

import RSSConverterService from "@/Services/RSSConverterService"
import MangaConverterService from "@/Services/MangaConverterService"

class ConversionModule {
	async convert (content: Content<unknown>): Promise<DocumentModel[]> {
		const converter = this.getConverterBySourceConfig(content.sourceConfig)

		return await converter.convert(content)
	}

	private getConverterBySourceConfig (sourceConfig: SourceConfig): ConverterContract<unknown> {
		const converterMap: Record<SourceConfig["type"], ConverterContract<unknown>> = {
			rss: RSSConverterService,
			manga: MangaConverterService
		}

		return converterMap[sourceConfig.type]
	}
}

export default ConversionModule
