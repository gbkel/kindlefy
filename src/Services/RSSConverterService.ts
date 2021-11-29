import fs from "fs"
import RSSParser from "rss-parser"
import EPUBParser from "epub-gen"
import { Calibre } from "node-calibre"

import { DocumentModel } from "@/Models/DocumentModel"

import { ConverterContract } from "@/Protocols/ConverterProtocol"
import { Content } from "@/Protocols/ImporterProtocol"
import { EbookConfig } from "@/Protocols/RSSConverterProtocol"

import TempFolderService from "@/Services/TempFolderService"

import FileUtil from "@/Utils/FileUtil"
import DateUtil from "@/Utils/DateUtil"

class RSSConverterService implements ConverterContract<Buffer> {
	private readonly rssParser = new RSSParser()
	private readonly calibre = new Calibre()

	async convert (content: Content<Buffer>): Promise<DocumentModel[]> {
		const ebookConfig = await this.RSSToEbookConfig(content.data)

		ebookConfig.title = `${ebookConfig.title} ${DateUtil.todayFormattedDate}`

		const epubFilePath = await this.EbookConfigToEPUB(ebookConfig)
		const mobiFilePath = await this.EPUBToMOBI(epubFilePath)

		const { filename } = FileUtil.parseFilePath(mobiFilePath)

		const mobiData = fs.createReadStream(mobiFilePath)

		return [{
			title: ebookConfig.title,
			filename,
			data: mobiData,
			type: content.sourceConfig.type
		}]
	}

	private async RSSToEbookConfig (rssBuffer: Buffer): Promise<EbookConfig> {
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

		return ebookConfig
	}

	private async EbookConfigToEPUB (ebookConfig: EbookConfig): Promise<string> {
		const epubFileName = `${ebookConfig.title}.epub`
		const epubFilePath = TempFolderService.mountTempPath(epubFileName)

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
