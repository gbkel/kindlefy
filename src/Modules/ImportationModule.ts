import { Content, ImporterContract } from "@/Protocols/ImporterProtocol"
import { SourceConfig } from "@/Protocols/SetupInputProtocol"

import RSSImporterService from "@/Services/RSSImporterService"

class ImportationModule {
	async import (sourceConfig: SourceConfig): Promise<Content> {
		const importer = this.getImporterBySourceConfig(sourceConfig)

		return await importer.import(sourceConfig)
	}

	private getImporterBySourceConfig (sourceConfig: SourceConfig): ImporterContract {
		const importerMap: Record<SourceConfig["type"], ImporterContract> = {
			rss: RSSImporterService
		}

		return importerMap[sourceConfig.type]
	}
}

export default ImportationModule
