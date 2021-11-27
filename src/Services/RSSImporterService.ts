import axios from "axios"

import { Content, ImporterContract } from "@/Protocols/ImporterProtocol"
import { SourceConfig } from "@/Protocols/SetupInputProtocol"

class RSSImporterService implements ImporterContract {
	async import (sourceConfig: SourceConfig): Promise<Content> {
		const rss = await axios.get(sourceConfig.url, {
			responseType: "arraybuffer"
		})

		return {
			data: rss.data,
			sourceConfig
		}
	}
}

export default new RSSImporterService()
