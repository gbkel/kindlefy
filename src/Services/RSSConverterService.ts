import fs from "fs"
import path from "path"
import RSSParser from "rss-parser"
import EPUBParser from "epub-gen"
import { Calibre } from "node-calibre"

import { DocumentModel } from "@/Models/DocumentModel"

import { ConverterContract } from "@/Protocols/ConverterProtocol"
import { Content } from "@/Protocols/ImporterProtocol"
import { EbookConfig } from "@/Protocols/RSSConverterProtocol"

import FileUtil from "@/Utils/FileUtil"

class RSSConverterService implements ConverterContract<Buffer> {
	private readonly rssParser = new RSSParser()
	private readonly calibre = new Calibre()

	async convert (content: Content<Buffer>): Promise<DocumentModel[]> {
		const epubFilePath = await this.RSSToEPUB(content.data)
		const mobiFilePath = await this.EPUBToMOBI(epubFilePath)

		const {
			filename,
			fullname
		} = FileUtil.parseFilePath(mobiFilePath)

		const mobiData = await fs.promises.readFile(mobiFilePath)

		await Promise.all([
			fs.promises.unlink(epubFilePath),
			fs.promises.unlink(mobiFilePath)
		])

		return [{
			title: filename,
			filename: fullname,
			data: mobiData,
			type: content.sourceConfig.type
		}]
	}

	private async RSSToEPUB (rssBuffer: Buffer): Promise<string> {
		const rssString = rssBuffer.toString()

		const parsedRSS = await this.rssParser.parseString(rssString)

		const ebookConfig: EbookConfig = {
			title: parsedRSS?.title,
			author: parsedRSS?.author,
			publisher: parsedRSS?.creator,
			cover: parsedRSS?.image?.url,
			content: parsedRSS?.items?.map(item => ({
				title: item?.title,
				author: item?.creator,
				data: item?.content
			}))
		}

		const epubFileName = `${parsedRSS.title}.epub`
		const epubFilePath = path.relative("tmp", epubFileName)

		const epubParser = new EPUBParser(ebookConfig, epubFilePath)

		await epubParser.promise

		return epubFilePath
	}

	private async EPUBToMOBI (epubFilePath: string): Promise<string> {
		const mobiFilePath = await this.calibre.ebookConvert(epubFilePath, "mobi")

		return mobiFilePath
	}
}

export default new RSSConverterService()
