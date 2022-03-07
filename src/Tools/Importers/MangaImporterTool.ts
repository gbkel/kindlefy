import { Content, ImporterContract } from "@/Protocols/ImporterProtocol"
import { SourceConfig } from "@/Protocols/SetupInputProtocol"
import { Manga, MangaImporterContract } from "@/Protocols/MangaImporterProtocol"

import MangaFreakImporterService from "@/Services/MangaFreakImporterService"
import MeusMangasImporterService from "@/Services/MeusMangasImporterService"

class MangaImporterTool implements ImporterContract<Manga> {
	async import (sourceConfig: SourceConfig): Promise<Content<Manga>> {
		const manga = await this.getMangaWithFallback(sourceConfig.name)

		return {
			data: manga,
			sourceConfig
		}
	}

	private async getMangaWithFallback (mangaName: string): Promise<Manga> {
		let manga: Manga

		const mangaImporters: MangaImporterContract[] = [
			MangaFreakImporterService,
			MeusMangasImporterService
		]

		for (const mangaImporterIndex in mangaImporters) {
			try {
				const mangaImporter = mangaImporters[mangaImporterIndex]

				manga = await mangaImporter.getManga(mangaName)

				break
			} catch (error) {
				const nextMangaImporterFallbackIndex = Number(mangaImporterIndex) + 1
				const isThereAnotherImporterToFallback = Boolean(mangaImporters[nextMangaImporterFallbackIndex])

				if (!isThereAnotherImporterToFallback) {
					return await Promise.reject(error)
				}
			}
		}

		return manga
	}
}

export default new MangaImporterTool()
