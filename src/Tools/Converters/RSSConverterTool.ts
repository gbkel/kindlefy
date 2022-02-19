import fs from "fs"

import { DocumentModel } from "@/Models/DocumentModel"

import { ConverterContract } from "@/Protocols/ConverterProtocol"
import { Content } from "@/Protocols/ImporterProtocol"
import { GenerateEPUBOptions, EpubContent } from "@/Protocols/EbookGeneratorProtocol"
import { SourceConfig } from "@/Protocols/SetupInputProtocol"

import TempFolderService from "@/Services/TempFolderService"
import ParserService from "@/Services/ParserService"
import EbookGeneratorService from "@/Services/EbookGeneratorService"
import ErrorHandlerService from "@/Services/ErrorHandlerService"

import FileUtil from "@/Utils/FileUtil"
import DateUtil from "@/Utils/DateUtil"
import MediumExporterUtil from "@/Utils/MediumExporterUtil"

import SourceValidation from "@/Validations/SourceValidation"

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

				const isMediumContent = SourceValidation.isMediumRSSSource(sourceConfig)

				if (isMediumContent) {
					content.data = await this.retrieveFullMediumContentData(content.data)
				}

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

	/**
	 * Medium RSS usually returns only the initial part of the post and adds a button
	 * to check more data on their website. Being minded about that, we use a workaround
	 * to retrieve the full post in HTML to turn it into EPUB later.
	 */
	private async retrieveFullMediumContentData (data: string): Promise<string> {
		let mediumEpubData = data

		const contentUrl = MediumExporterUtil.getPostUrlFromSeeMoreContent(data)

		if (contentUrl) {
			try {
				mediumEpubData = await MediumExporterUtil.getPostHTML(contentUrl)
			} catch (error) {
				ErrorHandlerService.handle(error)
			}
		}

		return mediumEpubData
	}
}

export default new RSSConverterTool()
