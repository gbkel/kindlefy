import axios, { AxiosInstance } from "axios"
import * as cheerio from "cheerio"

import { Content, ImporterContract } from "@/Protocols/ImporterProtocol"
import { SourceConfig } from "@/Protocols/SetupInputProtocol"
import {
	MangaSearchResult,
	MangaChapterSearchResult
} from "@/Protocols/MangaImporterProtocol"

class MangaImporterService implements ImporterContract<MangaChapterSearchResult[]> {
	private readonly client: AxiosInstance

	constructor () {
		this.client = axios.create({
			baseURL: "http://w12.mangafreak.net"
		})
	}

	async import (sourceConfig: SourceConfig): Promise<Content<MangaChapterSearchResult[]>> {
		const mangaChapters = await this.getMangaChapters(sourceConfig.name)

		const lastMangaChapters = mangaChapters
			.sort((a, b) => b.no - a.no)
			.slice(0, 5)

		return {
			data: lastMangaChapters,
			sourceConfig
		}
	}

	private async getMangaChapters (name: string): Promise<MangaChapterSearchResult[]> {
		const manga = await this.searchManga(name)

		const lastMangaChapters = await this.searchMangaChapters(manga.path)

		return lastMangaChapters
	}

	private async searchManga (name: string): Promise<MangaSearchResult> {
		try {
			const result = await this.client.get(`/Search/${name}`)

			const html = result.data as string

			const $ = cheerio.load(html)

			const links = $("a")

			const mangaList: MangaSearchResult[] = links.toArray()
				.filter(link => link.attribs.href.startsWith("/Manga/"))
				.map(link => ({
					path: link.attribs.href
				}))

			const [mostProbablyManga] = mangaList

			return mostProbablyManga
		} catch (error) {
			return null
		}
	}

	private async searchMangaChapters (mangaPath: string): Promise<MangaChapterSearchResult[]> {
		try {
			const mangaSlug = mangaPath.split("/").pop()

			const result = await this.client.get(mangaPath)

			const html = result.data as string

			const $ = cheerio.load(html)

			const rows = $("tbody > *").toArray()

			const chapters: MangaChapterSearchResult[] = rows.map((row, index) => {
				const subRows = row.children.filter(child => (child as any).name === "td")

				const title = (subRows?.[0] as any)?.children?.[0]?.children?.[0]?.data as string
				const createdAt = (subRows?.[1] as any)?.children?.[0]?.data as string

				const no = +title.match(/Chapter.\w+/g)[0]?.replace(/\D/g, "")

				return {
					no: no || (index + 1),
					title,
					createdAt,
					pagesFileUrl: `http://images.mangafreak.net/downloads/${mangaSlug}_${index}`
				}
			})

			return chapters
		} catch (error) {
			return []
		}
	}
}

export default new MangaImporterService()
