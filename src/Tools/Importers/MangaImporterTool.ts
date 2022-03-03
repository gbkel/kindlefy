import { Content, ImporterContract } from "@/Protocols/ImporterProtocol"
import { SourceConfig } from "@/Protocols/SetupInputProtocol"
import {
	MangaSearchResult,
	MangaChapterSearchResult,
	Manga
} from "@/Protocols/MangaImporterProtocol"

import HttpService from "@/Services/HttpService"
import ParserService from "@/Services/ParserService"

class MangaImporterTool implements ImporterContract<Manga> {
	private readonly httpService: HttpService
	private readonly parserService = new ParserService()

	constructor () {
		this.httpService = new HttpService({
			baseURL: "http://mangafreak.net"
		})
	}

	async import (sourceConfig: SourceConfig): Promise<Content<Manga>> {
		const manga = await this.getManga(sourceConfig.name)

		return {
			data: manga,
			sourceConfig
		}
	}

	private async getManga (name: string): Promise<Manga> {
		const manga = await this.searchManga(name)

		const mangaChapters = await this.searchMangaChapters(manga.path)

		return {
			title: manga.title,
			chapters: mangaChapters
		}
	}

	private async searchManga (name: string): Promise<MangaSearchResult> {
		const html = await this.httpService.toString(`/Search/${name}`)

		const $ = this.parserService.parseHTML(html)

		const links = $("a").toArray()

		const mangaList: MangaSearchResult[] = links
			.filter(link => link?.attribs?.href?.startsWith("/Manga/"))
			.filter(link => link?.children?.[0]?.type === "text")
			.map(link => ({
				path: link.attribs.href,
				title: (link?.children?.[0] as any)?.data
			}))

		const [mostProbablyManga] = mangaList

		return mostProbablyManga
	}

	private async searchMangaChapters (mangaPath: string): Promise<MangaChapterSearchResult[]> {
		const mangaSlug = mangaPath.split("/").pop()

		const html = await this.httpService.toString(mangaPath)

		const $ = this.parserService.parseHTML(html)

		const rows = $("tbody > *").toArray()

		const chapters: MangaChapterSearchResult[] = rows.map((row, index) => {
			const subRows = row.children.filter(child => (child as any).name === "td")

			const title = (subRows?.[0] as any)?.children?.[0]?.children?.[0]?.data as string
			const createdAt = (subRows?.[1] as any)?.children?.[0]?.data as string

			const chapterNumber = +title.match(/Chapter.\w+/g)[0]?.replace(/\D/g, "")

			const no = chapterNumber || (index + 1)

			return {
				no,
				title,
				createdAt,
				pagesFileUrl: `http://images.mangafreak.net/downloads/${mangaSlug}_${no}`
			}
		})

		return chapters
	}
}

export default new MangaImporterTool()
