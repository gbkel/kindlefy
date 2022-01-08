import { SourceConfig } from "@/Protocols/SetupInputProtocol"

class SourceValidation {
	isMediumRSSSource (sourceConfig: SourceConfig): boolean {
		const {
			type,
			url
		} = sourceConfig

		const isMediumUrl = url.includes("medium.com")
		const isRSSSource = type === "rss"

		const isMediumRSSSource = isRSSSource && isMediumUrl

		return isMediumRSSSource
	}
}

export default new SourceValidation()
