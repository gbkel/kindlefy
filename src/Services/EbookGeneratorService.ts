import EPUBParser from "epub-gen"

import { GenerateEPUBOptions } from "@/Protocols/EbookGeneratorProtocol"

import ProcessCommandService from "@/Services/ProcessCommandService"

class EbookGeneratorService {
	async generateEPUB (filePath: string, options: GenerateEPUBOptions): Promise<string> {
		const epubParser = new EPUBParser(options, filePath)

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

		await ProcessCommandService.run("ebook-convert", [cbzFilePath, mobiFilePath])

		return mobiFilePath
	}
}

export default EbookGeneratorService
