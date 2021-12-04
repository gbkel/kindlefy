import axios, { AxiosInstance } from "axios"
import * as cheerio from "cheerio"

import { Content, ImporterContract } from "@/Protocols/ImporterProtocol"
import { SourceConfig } from "@/Protocols/SetupInputProtocol"
import {
	MangaSearchResult,
	MangaChapterSearchResult,
	Manga
} from "@/Protocols/MangaImporterProtocol"

class MangaImporterTool implements ImporterContract<Manga> {
	private readonly client: AxiosInstance

	constructor () {
		this.client = axios.create({
			baseURL: "http://w12.mangafreak.net"
		})
	}

	async import (sourceConfig: SourceConfig): Promise<Content<Manga>> {
		const manga = await this.getManga(sourceConfig.name)

		const chaptersCount = sourceConfig.count ?? 1

		manga.chapters = manga.chapters
			.sort((a, b) => b.no - a.no)
			.slice(0, chaptersCount)

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
		const result = await this.client.get(`/Search/${name}`)

		const html = result.data as string

		const $ = cheerio.load(html)

		const links = $("a")

		const mangaList: MangaSearchResult[] = links.toArray()
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

		const result = await this.client.get(mangaPath)

		const html = result.data as string

		const $ = cheerio.load(html)

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
