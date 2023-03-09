import { Content, ImporterContract } from "@/Protocols/ImporterProtocol"
import { SourceConfig } from "@/Protocols/SetupInputProtocol"
import { Manga } from "@/Protocols/MangaImporterProtocol"

import MeusMangasImporterService from "@/Services/MeusMangasImporterService"
// import MangaReaderImporterService from "@/Services/MangaReaderImporterService"

class MangaImporterTool implements ImporterContract<Manga> {
	async import (sourceConfig: SourceConfig): Promise<Content<Manga>> {
		const manga = await MeusMangasImporterService.getManga(sourceConfig.name)

		return {
			data: manga,
			sourceConfig
		}
	}
}

export default new MangaImporterTool()
