import { Content, ImporterContract } from "@/Protocols/ImporterProtocol"
import { SourceConfig } from "@/Protocols/SetupInputProtocol"

import RSSImporterTool from "@/Tools/Importers/RSSImporterTool"
import MangaImporterTool from "@/Tools/Importers/MangaImporterTool"

class ImportationModule {
	async import (sourceConfig: SourceConfig): Promise<Content<unknown>> {
		const importer = this.getImporterBySourceConfig(sourceConfig)

		return await importer.import(sourceConfig)
	}

	private getImporterBySourceConfig (sourceConfig: SourceConfig): ImporterContract<unknown> {
		const importerMap: Record<SourceConfig["type"], ImporterContract<unknown>> = {
			rss: RSSImporterTool,
			manga: MangaImporterTool
		}

		return importerMap[sourceConfig.type]
	}
}

export default ImportationModule
