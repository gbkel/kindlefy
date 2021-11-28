import axios from "axios"
import { Calibre } from "node-calibre"
import fs from "fs"

import { DocumentModel } from "@/Models/DocumentModel"

import { ConverterContract } from "@/Protocols/ConverterProtocol"
import { Content } from "@/Protocols/ImporterProtocol"
import { Manga } from "@/Protocols/MangaImporterProtocol"

import TempFolderService from "@/Services/TempFolderService"

import FileUtil from "@/Utils/FileUtil"

class MangaConverterService implements ConverterContract<Manga> {
	private readonly calibre = new Calibre()

	async convert (content: Content<Manga>): Promise<DocumentModel[]> {
		const documents: DocumentModel[] = []

		for (const mangaChapter of content.data.chapters) {
			const fullChapterName = `${content.data.title} - ${mangaChapter.title}`

			const cbzFilePath = await this.URLToCBZ(mangaChapter.pagesFileUrl, fullChapterName)
			const mobiFilePath = await this.CBZToMOBI(cbzFilePath)

			const mobiData = fs.createReadStream(mobiFilePath)

			const { filename } = FileUtil.parseFilePath(mobiFilePath)

			documents.push({
				title: fullChapterName,
				filename,
				data: mobiData,
				type: content.sourceConfig.type
			})
		}

		return documents
	}

	private async URLToCBZ (url: string, title: string): Promise<string> {
		console.log(url)
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

export default new MangaConverterService()
