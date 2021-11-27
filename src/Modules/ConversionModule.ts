import { DocumentModel } from "@/Models/DocumentModel"

import { Content } from "@/Protocols/ImporterProtocol"
import { SourceConfig } from "@/Protocols/SetupInputProtocol"
import { ConverterContract } from "@/Protocols/ConverterProtocol"

import RSSConverterService from "@/Services/RSSConverterService"

class ConversionModule {
	async convert (content: Content): Promise<DocumentModel> {
		const converter = this.getConverterBySourceConfig(content.sourceConfig)

		return await converter.convert(content)
	}

	private getConverterBySourceConfig (sourceConfig: SourceConfig): ConverterContract {
		const converterMap: Record<SourceConfig["type"], ConverterContract> = {
			rss: RSSConverterService
		}

		return converterMap[sourceConfig.type]
	}
}

export default ConversionModule
