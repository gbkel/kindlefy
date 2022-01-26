import EPUBGenerator from "epub-gen"

import {
	GenerateEPUBOptions,
	EbookConvertOptions
} from "@/Protocols/EbookGeneratorProtocol"

import ProcessCommandService from "@/Services/ProcessCommandService"

import SanitizationUtil from "@/Utils/SanitizationUtil"

class EbookGeneratorService {
	private readonly defaultEbookConvertOptions: EbookConvertOptions = {
		authors: "Kindlefy"
	}

	async generateEPUB (filePath: string, options: GenerateEPUBOptions): Promise<string> {
		const epubParser = new EPUBGenerator(options, filePath)

		await epubParser.promise

		return filePath
	}

	async generateMOBIFromEPUB (epubFilePath: string): Promise<string> {
		const mobiFilePath = SanitizationUtil.sanitizeFilename(`${epubFilePath}.mobi`)

		await ProcessCommandService.run("ebook-convert", [epubFilePath, mobiFilePath], {
			...this.defaultEbookConvertOptions
		})

		return mobiFilePath
	}

	async generateMOBIFromCBZ (cbzFilePath: string): Promise<string> {
		const mobiFilePath = SanitizationUtil.sanitizeFilename(`${cbzFilePath}.mobi`)

		const options: EbookConvertOptions = {
			noInlineToc: true,
			outputProfile: "tablet",
			right2left: false,
			landscape: true,
			...this.defaultEbookConvertOptions
		}

		await ProcessCommandService.run("ebook-convert", [cbzFilePath, mobiFilePath], options)

		return mobiFilePath
	}
}

export default EbookGeneratorService
