import { SourceConfig } from "@/Protocols/SetupInputProtocol"
import {
	ContentType,
	ContentEnricher,
	ContentTypeValidator
} from "@/Protocols/RSSContentEnricherProtocol"

import MediumExporterUtil from "@/Utils/MediumExporterUtil"

import SourceValidation from "@/Validations/SourceValidation"

import ErrorHandlerService from "@/Services/ErrorHandlerService"

class RSSContentEnricherService {
	async enrich (sourceConfig: SourceConfig, content: string): Promise<string> {
		const contentType = this.getContentTypeBySourceConfig(sourceConfig)

		const contentEnricher = this.getEnricherByContentType(contentType)

		const enrichedContent = await contentEnricher(content)

		return enrichedContent
	}

	private getContentTypeBySourceConfig (sourceConfig: SourceConfig): ContentType {
		let contentType: ContentType

		const contentTypeValidatorMap: Record<ContentType, ContentTypeValidator> = {
			medium: (data) => SourceValidation.isMediumRSSSource(data)
		}

		Object.entries(contentTypeValidatorMap).forEach(([validatorContentType, validator]) => {
			const foundContentType = validator(sourceConfig)

			if (foundContentType) {
				contentType = validatorContentType as ContentType
			}
		})

		return contentType
	}

	private getEnricherByContentType (contentType: ContentType): ContentEnricher {
		const contentEnricherMap: Record<ContentType | "default", ContentEnricher> = {
			medium: async (content) => await this.enrichMediumContent(content),
			default: async (content) => await Promise.resolve(content)
		}

		return contentEnricherMap[contentType] || contentEnricherMap.default
	}

	/**
	 * Medium RSS usually returns only the initial part of the post and adds a button
	 * to check more data on their website. Being minded about that, we use a workaround
	 * to retrieve the full post in HTML to turn it into EPUB later.
	 */
	private async enrichMediumContent (data: string): Promise<string> {
		let mediumEpubData = data

		const contentUrl = MediumExporterUtil.getPostUrlFromSeeMoreContent(data)

		if (contentUrl) {
			try {
				mediumEpubData = await MediumExporterUtil.getPostHTML(contentUrl)
			} catch (error) {
				ErrorHandlerService.handle(error)
			}
		}

		return mediumEpubData
	}
}

export default new RSSContentEnricherService()
