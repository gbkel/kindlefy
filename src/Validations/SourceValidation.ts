import { SourceConfig } from "@/Protocols/SetupInputProtocol"

class SourceValidation {
	isMediumRSSSource (sourceConfig: SourceConfig): boolean {
		return this.isSpecificRSSSource("medium.com", sourceConfig)
	}

	private isSpecificRSSSource (matchUrl: string, sourceConfig: SourceConfig): boolean {
		const {
			type,
			url
		} = sourceConfig

		const isMediumUrl = url.includes(matchUrl)
		const isRSSSource = type === "rss"

		const isMediumRSSSource = isRSSSource && isMediumUrl

		return isMediumRSSSource
	}
}

export default new SourceValidation()
