import { SourceConfig } from "@/Protocols/SetupInputProtocol"
import {
	ContentType,
	ContentEnricher,
	ContentTypeValidator
} from "@/Protocols/RSSContentEnricherProtocol"
import { ParsedRSSItem } from "@/Protocols/ParserProtocol"

import MediumImporterService from "@/Services/MediumImporterService"
import ErrorHandlerService from "@/Services/ErrorHandlerService"

import SourceValidation from "@/Validations/SourceValidation"

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
			medium: (sourceConfig) => SourceValidation.isMediumRSSSource(sourceConfig)
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
			default: async (parsedRSSItem) => await this.enrichDefaultContent(parsedRSSItem)
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

		const contentUrl = MediumImporterService.getPostUrlFromSeeMoreContent(parsedRSSItem.content)

		if (contentUrl) {
			try {
				content = await MediumImporterService.getPostHTML(contentUrl)
			} catch (error) {
				ErrorHandlerService.handle(error)
			}
		}

		return content
	}

	/**
	 * Most of the RSS feeds put full content inside a property called "content:encoded", instead
	 * of using the "content" property.
	 */
	private async enrichDefaultContent (parsedRSSItem: ParsedRSSItem): Promise<string> {
		const fullPostContent = parsedRSSItem.rawData["content:encoded"] as string
		const shortPostContent = parsedRSSItem.content

		return fullPostContent || shortPostContent
	}
}

export default new RSSContentEnricherService()
