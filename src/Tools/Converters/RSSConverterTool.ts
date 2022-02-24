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
import QueueService from "@/Services/QueueService"

import FileUtil from "@/Utils/FileUtil"
import DateUtil from "@/Utils/DateUtil"
import DataManipulationUtil from "@/Utils/DataManipulationUtil"

class RSSConverterTool implements ConverterContract<Buffer> {
	private readonly queueService = new QueueService({ concurrency: 10 })
	private readonly parserService = new ParserService()
	private readonly ebookGeneratorService = new EbookGeneratorService()

	async convert (content: Content<Buffer>): Promise<DocumentModel[]> {
		const EPUBConfigs = await this.RSSToEPUBConfig(content.data, content.sourceConfig)

		const documents: DocumentModel[] = await Promise.all(
			EPUBConfigs.map(async EPUBConfig => (
				await this.queueService.enqueue(async () => {
					const epubFilePath = await this.EPUBConfigToEPUB(EPUBConfig)
					const mobiFilePath = await this.EPUBToMOBI(epubFilePath)

					const { filename } = FileUtil.parseFilePath(mobiFilePath)

					const mobiData = fs.createReadStream(mobiFilePath)

					return {
						title: EPUBConfig.title,
						filename,
						data: mobiData,
						type: content.sourceConfig.type
					}
				})
			))
		)

		return documents
	}

	private async RSSToEPUBConfig (rssBuffer: Buffer, sourceConfig: SourceConfig): Promise<GenerateEPUBOptions[]> {
		const rssString = rssBuffer.toString()

		const parsedRSS = await this.parserService.parseRSS(rssString)

		parsedRSS.items = DataManipulationUtil.manipulateArray(parsedRSS.items, {
			order: {
				property: "publishDate",
				type: sourceConfig?.order ?? "desc"
			},
			limit: sourceConfig.count
		})

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

		let EPUBConfigs: GenerateEPUBOptions[] = []

		const turnPostsIntoMultipleDocuments = Boolean(sourceConfig?.splitRSSPosts)

		if (turnPostsIntoMultipleDocuments) {
			EPUBConfigs = content.map(item => ({
				title: item.title,
				author: item.author,
				publisher: parsedRSS.creator,
				cover: parsedRSS.imageUrl,
				content: [item]
			}))
		} else {
			EPUBConfigs = [{
				title: `${parsedRSS.title} ${DateUtil.todayFormattedDate}`,
				author: parsedRSS.author,
				publisher: parsedRSS.creator,
				cover: parsedRSS.imageUrl,
				content
			}]
		}

		return EPUBConfigs
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
