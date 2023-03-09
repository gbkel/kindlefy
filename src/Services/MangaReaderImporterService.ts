import fs from "fs"
import FormData from "form-data"

import {
	MangaSearchResult,
	MangaChapterSearchResult,
	Manga,
	MangaImporterContract
} from "@/Protocols/MangaImporterProtocol"
import { MangaReaderSearchResult, RawChapter, RawChapterPicture } from "@/Protocols/MangaReaderProtocol"

import HttpService from "@/Services/HttpService"
import CrawlerService from "@/Services/CrawlerService"
import CompressionService from "@/Services/CompressionService"
import TempFolderService from "@/Services/TempFolderService"

import FileUtil from "@/Utils/FileUtil"
import SanitizationUtil from "@/Utils/SanitizationUtil"

class MangaReaderImporterService implements MangaImporterContract {
	private readonly httpService: HttpService
	private readonly websiteBaseURL = "https://mangareader.cc"

	constructor () {
		this.httpService = new HttpService({
			baseURL: this.websiteBaseURL
		})
	}

	async getManga (name: string): Promise<Manga> {
		const manga = await this.searchManga(name)

		const mangaChapters = await this.searchMangaChapters(manga)

		return {
			title: manga.title,
			chapters: mangaChapters,
			coverUrl: manga.coverUrl
		}
	}

	private async searchManga (name: string): Promise<MangaSearchResult> {
		const formData = new FormData()

		formData.append("action", "ajaxy_sf")
		formData.append("search", "false")
		formData.append("sf_value", name)

		const response = await this.httpService.makeRawRequest<MangaReaderSearchResult>("POST", "/search-autocomplete", formData, {
			headers: {
				"Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`
			}
		})

		const [manga] = Object.values(response?.manga?.[0]?.all)
		const mangaPath = manga.post_link.replace(this.websiteBaseURL, "")

		return {
			title: manga.post_title,
			path: mangaPath,
			coverUrl: manga.post_image
		}
	}

	private async searchMangaChapters (manga: MangaSearchResult): Promise<MangaChapterSearchResult[]> {
		const rawChapters = await this.getRawChaptersByMangaPath(manga.path)

		const chapters: MangaChapterSearchResult[] = rawChapters.map(rawChapter => {
			const title = `Chapter ${rawChapter.no}`
			const no = rawChapter.no

			return {
				no,
				title,
				getZipFile: async () => {
					const rawChapterPictures = await this.getRawChapterPictures(rawChapter.path)

					const compressionService = new CompressionService()

					const zipFileName = SanitizationUtil.sanitizeFilename(`${manga.title}-${no}.zip`)
					const zipFilePath = await TempFolderService.mountTempPath(zipFileName)

					const zipFileStream = fs.createWriteStream(zipFilePath)

					compressionService.pipe(zipFileStream)

					const httpService = new HttpService({})

					await Promise.all(
						rawChapterPictures.map(async rawChapterPicture => {
							const rawChapterPictureReadStream = await httpService.toReadStream(rawChapterPicture.url)

							const { filename } = FileUtil.parseFilePath(rawChapterPicture.url)

							compressionService.addFile({ data: rawChapterPictureReadStream, fileName: filename })
						})
					)

					await compressionService.compress()

					const zipFile = await fs.promises.readFile(zipFilePath)

					return {
						data: zipFile,
						path: zipFilePath
					}
				}
			}
		})

		return chapters
	}

	private async getRawChaptersByMangaPath (mangaPath: string): Promise<RawChapter[]> {
		const html = await this.httpService.toString(mangaPath)

		const rawChapters: RawChapter[] = []

		const chapterListElements = CrawlerService.findElements({
			html,
			selector: ".cl > ul > li"
		})

		chapterListElements.forEach(chapterListElement => {
			const chapterTitleElement = CrawlerService.getElementByClassName(chapterListElement, "xanh")

			const chapterTitle = chapterTitleElement.children?.[0]?.data || ""
			const chapterRawNumber = chapterTitle.split(" ")?.pop()
			const chapterNumber = parseInt(chapterRawNumber)

			const chapterUrl = chapterTitleElement.attribs.href
			const chapterPath = chapterUrl?.replace(this.websiteBaseURL, "")

			/**
			 * Avoid chapters with float numbers, such as 100.5, 1030.5, etc.
			 */
			const isValidChapterNumber = Number.isInteger(chapterNumber)

			if (isValidChapterNumber) {
				rawChapters.push({
					no: chapterNumber,
					path: chapterPath
				})
			}
		})

		return rawChapters
	}

	private async getRawChapterPictures (chapterPath: string): Promise<RawChapterPicture[]> {
		const html = await this.httpService.toString(chapterPath)

		const chapterPictureElements = CrawlerService.findElements({
			html,
			selector: "#arraydata"
		})

		const rawChapterPictureData = chapterPictureElements?.[0]?.children?.[0]?.data

		const rawChapterPictures: RawChapterPicture[] = rawChapterPictureData?.split(",")?.map((chapterPictureUrl, index) => ({
			url: chapterPictureUrl,
			order: index + 1
		}))

		return rawChapterPictures
	}
}

export default new MangaReaderImporterService()
