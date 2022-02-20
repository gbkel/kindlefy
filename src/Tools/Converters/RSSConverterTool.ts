import fs from "fs"

import { DocumentModel } from "@/Models/DocumentModel"

import { ConverterContract } from "@/Protocols/ConverterProtocol"
import { Content } from "@/Protocols/ImporterProtocol"
import { GenerateEPUBOptions, EpubContent } from "@/Protocols/EbookGeneratorProtocol"
import { SourceConfig } from "@/Protocols/SetupInputProtocol"

import TempFolderService from "@/Services/TempFolderService"
import ParserService from "@/Services/ParserService"
import EbookGeneratorService from "@/Services/EbookGeneratorService"
import RSSContentEnricherService from "@/Services/RSSContentEnricherService"

import FileUtil from "@/Utils/FileUtil"
import DateUtil from "@/Utils/DateUtil"

class RSSConverterTool implements ConverterContract<Buffer> {
	private readonly parserService = new ParserService()
	private readonly ebookGeneratorService = new EbookGeneratorService()

	async convert (content: Content<Buffer>): Promise<DocumentModel[]> {
		const EPUBConfig = await this.RSSToEPUBConfig(content.data, content.sourceConfig)

		EPUBConfig.title = `${EPUBConfig.title} ${DateUtil.todayFormattedDate}`

		const epubFilePath = await this.EPUBConfigToEPUB(EPUBConfig)
		const mobiFilePath = await this.EPUBToMOBI(epubFilePath)

		const { filename } = FileUtil.parseFilePath(mobiFilePath)

		const mobiData = fs.createReadStream(mobiFilePath)

		return [{
			title: EPUBConfig.title,
			filename,
			data: mobiData,
			type: content.sourceConfig.type
		}]
	}

	private async RSSToEPUBConfig (rssBuffer: Buffer, sourceConfig: SourceConfig): Promise<GenerateEPUBOptions> {
		const rssString = rssBuffer.toString()

		const parsedRSS = await this.parserService.parseRSS(rssString)

		const content: EpubContent[] = await Promise.all(
			parsedRSS.items?.map(async item => {
				const content: EpubContent = {
					title: item.title,
					author: item.creator,
					data: item.content
				}

				content.data = await RSSContentEnricherService.enrich(sourceConfig, content.data)

				return content
			})
		)

		const EPUBConfig: GenerateEPUBOptions = {
			title: parsedRSS.title,
			author: parsedRSS.author,
			publisher: parsedRSS.creator,
			cover: parsedRSS.imageUrl,
			content
		}

		return EPUBConfig
	}

	private async EPUBConfigToEPUB (EPUBConfig: GenerateEPUBOptions): Promise<string> {
		const epubFileName = `${EPUBConfig.title}.epub`
		const epubFilePath = TempFolderService.mountTempPath(epubFileName)

		await this.ebookGeneratorService.generateEPUB(epubFilePath, EPUBConfig)

		return epubFilePath
	}

	private async EPUBToMOBI (epubFilePath: string): Promise<string> {
		const mobiFilePath = await this.ebookGeneratorService.generateMOBIFromEPUB(epubFilePath)

		return mobiFilePath
	}
}

export default new RSSConverterTool()
