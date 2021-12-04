import fs from "fs"

import { DocumentModel } from "@/Models/DocumentModel"

import { ConverterContract } from "@/Protocols/ConverterProtocol"
import { Content } from "@/Protocols/ImporterProtocol"
import { Manga } from "@/Protocols/MangaImporterProtocol"

import TempFolderService from "@/Services/TempFolderService"
import QueueService from "@/Services/QueueService"
import HttpService from "@/Services/HttpService"
import EbookGeneratorService from "@/Services/EbookGeneratorService"

import FileUtil from "@/Utils/FileUtil"

class MangaConverterTool implements ConverterContract<Manga> {
	private readonly queueService = new QueueService({ concurrency: 5 })
	private readonly httpService = new HttpService({})
	private readonly ebookGeneratorService = new EbookGeneratorService()

	async convert (content: Content<Manga>): Promise<DocumentModel[]> {
		const documents: DocumentModel[] = await Promise.all(
			content.data.chapters.map(async mangaChapter => (
				await this.queueService.enqueue(async () => {
					const fullChapterName = `${content.data.title} - ${mangaChapter.title}`

					const cbzFilePath = await this.URLToCBZ(mangaChapter.pagesFileUrl, fullChapterName)
					const mobiFilePath = await this.CBZToMOBI(cbzFilePath)

					const mobiData = fs.createReadStream(mobiFilePath)

					const { filename } = FileUtil.parseFilePath(mobiFilePath)

					return {
						title: fullChapterName,
						filename,
						data: mobiData,
						type: content.sourceConfig.type
					}
				})
			))
		)

		return documents
	}

	private async URLToCBZ (url: string, title: string): Promise<string> {
		const buffer = await this.httpService.toBuffer(url)

		const cbzFileName = `${title}.cbz`
		const cbzFilePath = TempFolderService.mountTempPath(cbzFileName)

		await fs.promises.writeFile(cbzFilePath, buffer)

		return cbzFilePath
	}

	private async CBZToMOBI (cbzFilePath: string): Promise<string> {
		const mobiFilePath = await this.ebookGeneratorService.generateMOBIFromCBZ(cbzFilePath)

		return mobiFilePath
	}
}

export default new MangaConverterTool()
