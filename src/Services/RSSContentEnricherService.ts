import { SourceConfig } from "@/Protocols/SetupInputProtocol"
import {
	ContentType,
	ContentEnricher,
	ContentTypeValidator
} from "@/Protocols/RSSContentEnricherProtocol"
import { ParsedRSSItem } from "@/Protocols/ParserProtocol"

import MediumExporterUtil from "@/Utils/MediumExporterUtil"

import SourceValidation from "@/Validations/SourceValidation"

import ErrorHandlerService from "@/Services/ErrorHandlerService"

class RSSContentEnricherService {
	async enrich (sourceConfig: SourceConfig, parsedRSSItem: ParsedRSSItem): Promise<string> {
		const contentType = this.getContentTypeBySourceConfig(sourceConfig)

		const contentEnricher = this.getEnricherByContentType(contentType)

		const enrichedContent = await contentEnricher(parsedRSSItem)

		return enrichedContent
	}

	private getContentTypeBySourceConfig (sourceConfig: SourceConfig): ContentType {
		let contentType: ContentType

		const contentTypeValidatorMap: Record<ContentType, ContentTypeValidator> = {
			medium: (sourceConfig) => SourceValidation.isMediumRSSSource(sourceConfig),
			quastor: (sourceConfig) => SourceValidation.isQuastorRSSSource(sourceConfig)
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
			medium: async (parsedRSSItem) => await this.enrichMediumContent(parsedRSSItem),
			quastor: async (parsedRSSItem) => await this.enrichQuastorContent(parsedRSSItem),
			default: async (parsedRSSItem) => await Promise.resolve(parsedRSSItem.content)
		}

		return contentEnricherMap[contentType] || contentEnricherMap.default
	}

	/**
	 * Medium RSS usually returns only the initial part of the post and adds a button
	 * to check more data on their website. Being minded about that, we use a workaround
	 * to retrieve the full post in HTML to turn it into EPUB later.
	 */
	private async enrichMediumContent (parsedRSSItem: ParsedRSSItem): Promise<string> {
		let content = parsedRSSItem.content

		const contentUrl = MediumExporterUtil.getPostUrlFromSeeMoreContent(parsedRSSItem.content)

		if (contentUrl) {
			try {
				content = await MediumExporterUtil.getPostHTML(contentUrl)
			} catch (error) {
				ErrorHandlerService.handle(error)
			}
		}

		return content
	}

	/**
	 * Quastor RSS usually saves all the post data in a field called "content:encoded".
	 */
	private async enrichQuastorContent (parsedRSSItem: ParsedRSSItem): Promise<string> {
		const fullPostContent = parsedRSSItem.rawData["content:encoded"] as string
		const shortPostContent = parsedRSSItem.content

		return fullPostContent || shortPostContent
	}
}

export default new RSSContentEnricherService()
