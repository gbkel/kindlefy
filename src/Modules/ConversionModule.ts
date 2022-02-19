import { DocumentModel } from "@/Models/DocumentModel"

import { Content } from "@/Protocols/ImporterProtocol"
import { SourceConfig } from "@/Protocols/SetupInputProtocol"
import { ConverterContract } from "@/Protocols/ConverterProtocol"

import RSSConverterTool from "@/Tools/Converters/RSSConverterTool"
import MangaConverterTool from "@/Tools/Converters/MangaConverterTool"

class ConversionModule {
	async convert (content: Content<unknown>): Promise<DocumentModel[]> {
		const converter = this.getConverterBySourceConfig(content.sourceConfig)

		return await converter.convert(content)
	}

	private getConverterBySourceConfig (sourceConfig: SourceConfig): ConverterContract<unknown> {
		const converterMap: Record<SourceConfig["type"], ConverterContract<unknown>> = {
			rss: RSSConverterTool,
			manga: MangaConverterTool
		}

		return converterMap[sourceConfig.type]
	}
}

export default ConversionModule
