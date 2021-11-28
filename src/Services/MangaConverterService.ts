import axios from "axios"
import { Calibre } from "node-calibre"
import fs from "fs"
import path from "path"

import { DocumentModel } from "@/Models/DocumentModel"

import { ConverterContract } from "@/Protocols/ConverterProtocol"
import { Content } from "@/Protocols/ImporterProtocol"
import { MangaChapterSearchResult } from "@/Protocols/MangaImporterProtocol"

import FileUtil from "@/Utils/FileUtil"

class MangaConverterService implements ConverterContract<MangaChapterSearchResult[]> {
	private readonly calibre = new Calibre()

	async convert (content: Content<MangaChapterSearchResult[]>): Promise<DocumentModel[]> {
		const documents: DocumentModel[] = []

		for (const mangaChapter of content.data) {
			const cbzFilePath = await this.URLToCBZ(mangaChapter.pagesFileUrl, mangaChapter.title)
			const mobiFilePath = await this.CBZToMOBI(cbzFilePath)

			const mobiData = await fs.promises.readFile(mobiFilePath)

			await Promise.all([
				fs.promises.unlink(cbzFilePath),
				fs.promises.unlink(mobiFilePath)
			])

			const {
				filename,
				fullname
			} = FileUtil.parseFilePath(mobiFilePath)

			documents.push({
				title: filename,
				filename: fullname,
				data: mobiData,
				type: content.sourceConfig.type
			})
		}

		return documents
	}

	private async URLToCBZ (url: string, title: string): Promise<string> {
		const result = await axios.get(url, {
			responseType: "arraybuffer"
		})

		const cbzFileName = `${title}.cbz`
		const cbzFilePath = path.relative("tmp", cbzFileName)

		await fs.promises.writeFile(cbzFilePath, result.data)

		return cbzFilePath
	}

	private async CBZToMOBI (cbzFilePath: string): Promise<string> {
		const mobiFilePath = await this.calibre.ebookConvert(cbzFilePath, "mobi")

		return mobiFilePath
	}
}

export default new MangaConverterService()
