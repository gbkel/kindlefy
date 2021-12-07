import EPUBGenerator from "epub-gen"

import {
	GenerateEPUBOptions,
	EbookConvertOptions
} from "@/Protocols/EbookGeneratorProtocol"

import ProcessCommandService from "@/Services/ProcessCommandService"

class EbookGeneratorService {
	async generateEPUB (filePath: string, options: GenerateEPUBOptions): Promise<string> {
		const epubParser = new EPUBGenerator(options, filePath)

		await epubParser.promise

		return filePath
	}

	async generateMOBIFromEPUB (epubFilePath: string): Promise<string> {
		const mobiFilePath = `${epubFilePath}.mobi`

		await ProcessCommandService.run("ebook-convert", [epubFilePath, mobiFilePath])

		return mobiFilePath
	}

	async generateMOBIFromCBZ (cbzFilePath: string): Promise<string> {
		const mobiFilePath = `${cbzFilePath}.mobi`

		const options: EbookConvertOptions = {
			noInlineToc: true,
			outputProfile: "tablet",
			right2left: true
		}

		await ProcessCommandService.run("ebook-convert", [cbzFilePath, mobiFilePath], options)

		return mobiFilePath
	}
}

export default EbookGeneratorService
