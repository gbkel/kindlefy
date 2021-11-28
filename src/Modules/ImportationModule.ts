import { Content, ImporterContract } from "@/Protocols/ImporterProtocol"
import { SourceConfig } from "@/Protocols/SetupInputProtocol"

import RSSImporterService from "@/Services/RSSImporterService"
import MangaImporterService from "@/Services/MangaImporterService"

class ImportationModule {
	async import (sourceConfig: SourceConfig): Promise<Content<unknown>> {
		const importer = this.getImporterBySourceConfig(sourceConfig)

		return await importer.import(sourceConfig)
	}

	private getImporterBySourceConfig (sourceConfig: SourceConfig): ImporterContract<unknown> {
		const importerMap: Record<SourceConfig["type"], ImporterContract<unknown>> = {
			rss: RSSImporterService,
			manga: MangaImporterService
		}

		return importerMap[sourceConfig.type]
	}
}

export default ImportationModule
