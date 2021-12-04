import axios from "axios"
import { Calibre } from "node-calibre"
import fs from "fs"

import { DocumentModel } from "@/Models/DocumentModel"

import { ConverterContract } from "@/Protocols/ConverterProtocol"
import { Content } from "@/Protocols/ImporterProtocol"
import { Manga } from "@/Protocols/MangaImporterProtocol"

import TempFolderService from "@/Services/TempFolderService"
import QueueService from "@/Services/QueueService"

import FileUtil from "@/Utils/FileUtil"

class MangaConverterTool implements ConverterContract<Manga> {
	private readonly calibre = new Calibre()
	private readonly queue = new QueueService({ concurrency: 5 })

	async convert (content: Content<Manga>): Promise<DocumentModel[]> {
		const documents: DocumentModel[] = await Promise.all(
			content.data.chapters.map(async mangaChapter => (
				await this.queue.enqueue(async () => {
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
		const result = await axios.get(url, {
			responseType: "arraybuffer"
		})

		const cbzFileName = `${title}.cbz`
		const cbzFilePath = TempFolderService.mountTempPath(cbzFileName)

		await fs.promises.writeFile(cbzFilePath, result.data)

		return cbzFilePath
	}

	private async CBZToMOBI (cbzFilePath: string): Promise<string> {
		const mobiFilePath = await this.calibre.ebookConvert(cbzFilePath, "mobi")

		return mobiFilePath
	}
}

export default new MangaConverterTool()
