import fs from "fs"

import { DocumentModel } from "@/Models/DocumentModel"

import { ConverterContract } from "@/Protocols/ConverterProtocol"
import { Content } from "@/Protocols/ImporterProtocol"
import { GenerateEPUBOptions, EpubContent } from "@/Protocols/EbookGeneratorProtocol"
import { SourceConfig } from "@/Protocols/SetupInputProtocol"


import EbookGeneratorService from "@/Services/EbookGeneratorService"
import QueueService from "@/Services/QueueService"

import FileUtil from "@/Utils/FileUtil"
import DateUtil from "@/Utils/DateUtil"

class RecipeConverterTool implements ConverterContract<Buffer> {
	private readonly queueService = new QueueService({ concurrency: 10 })
	private readonly ebookGeneratorService = new EbookGeneratorService()

	async convert(content: Content<Buffer>): Promise<DocumentModel[]> {
		const EPUBConfigs = await this.RecipeToEPUBConfig(content.sourceConfig)
		const epubFilePath = content.sourceConfig.name
		const documents: DocumentModel[] = await Promise.all(
			EPUBConfigs.map(async EPUBConfig => (
				await this.queueService.enqueue(async () => {

					const mobiFilePath = await this.RecipeToMOBI(epubFilePath)

					const { filename } = FileUtil.parseFilePath(mobiFilePath)

					const mobiData = fs.createReadStream(mobiFilePath)

					return new DocumentModel({
						title: EPUBConfig.title,
						filename,
						data: mobiData,
						type: content.sourceConfig.type
					})
				})
			))
		)

		return documents
	}

	private async RecipeToEPUBConfig(sourceConfig: SourceConfig): Promise<GenerateEPUBOptions[]> {
		const metadataTitle = sourceConfig.name
		const metadataSubTitle = DateUtil.todayFormattedDate
		const content_data: EpubContent = {
			title: "",
			author: "",
			data: ""
		}

		return [{
			title: `${metadataTitle} ${metadataSubTitle}`,
			author: null,
			publisher: null,
			cover: null,
			content: [content_data],
			metadata: {
				title: metadataTitle,
				subTitle: metadataSubTitle
			}
		}]

	}

	private async RecipeToMOBI(epubFilePath: string): Promise<string> {
		const recipe_name = `${epubFilePath}.recipe`
		const mobiFilePath = await this.ebookGeneratorService.generateMOBIFromEPUB(recipe_name)
		return mobiFilePath
	}
}

export default new RecipeConverterTool()
