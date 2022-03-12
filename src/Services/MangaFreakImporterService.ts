import {
	MangaSearchResult,
	MangaChapterSearchResult,
	Manga,
	MangaImporterContract
} from "@/Protocols/MangaImporterProtocol"

import HttpService from "@/Services/HttpService"
import CrawlerService from "@/Services/CrawlerService"

class MangaFreakImporterService implements MangaImporterContract {
	private readonly httpService: HttpService

	constructor () {
		this.httpService = new HttpService({
			baseURL: "https://mangafreak.net",
			withProxy: true
		})
	}

	async getManga (name: string): Promise<Manga> {
		const manga = await this.searchManga(name)

		const mangaChapters = await this.searchMangaChapters(manga.path)

		return {
			title: manga.title,
			chapters: mangaChapters
		}
	}

	private async searchManga (name: string): Promise<MangaSearchResult> {
		const html = await this.httpService.toString(`/Search/${name}`)

		const links = CrawlerService.findElements({
			html,
			selector: "a"
		})

		const mangaList: MangaSearchResult[] = links
			.filter(link => link?.attribs?.href?.startsWith("/Manga/"))
			.filter(link => link?.children?.[0]?.type === "text")
			.map(link => ({
				path: link.attribs.href,
				title: link?.children?.[0]?.data
			}))

		const [mostProbablyManga] = mangaList

		return mostProbablyManga
	}

	private async searchMangaChapters (mangaPath: string): Promise<MangaChapterSearchResult[]> {
		const mangaSlug = mangaPath.split("/").pop()

		const html = await this.httpService.toString(mangaPath)

		const rows = CrawlerService.findElements({
			html,
			selector: "tbody > *"
		})

		const chapters: MangaChapterSearchResult[] = rows.map((row, index) => {
			const subRows = row.children.filter(child => child.name === "td")

			const title = subRows?.[0]?.children?.[0]?.children?.[0]?.data
			const createdAt = subRows?.[1]?.children?.[0]?.data

			const chapterNumber = +title.match(/Chapter.\w+/g)[0]?.replace(/\D/g, "")

			const no = chapterNumber || (index + 1)

			return {
				no,
				title,
				createdAt,
				getPagesFile: async () => {
					const httpService = new HttpService({})

					const pagesFileUrl = `http://images.mangafreak.net/downloads/${mangaSlug}_${no}`

					const buffer = await httpService.toBuffer(pagesFileUrl)

					return buffer
				}
			}
		})

		return chapters
	}
}

export default new MangaFreakImporterService()
