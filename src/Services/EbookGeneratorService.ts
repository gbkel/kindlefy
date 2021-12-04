import EPUBParser from "epub-gen"
import { Calibre } from "node-calibre"

import { GenerateEPUBOptions } from "@/Protocols/EbookGeneratorProtocol"

class EbookGeneratorService {
	async generateEPUB (filePath: string, options: GenerateEPUBOptions): Promise<string> {
		const epubParser = new EPUBParser(options, filePath)

		await epubParser.promise

		return filePath
	}

	async generateMOBIFromEPUB (epubFilePath: string): Promise<string> {
		const calibre = new Calibre()

		const mobiFilePath = await calibre.ebookConvert(epubFilePath, "mobi")

		return mobiFilePath
	}

	async generateMOBIFromCBZ (cbzFilePath: string): Promise<string> {
		const calibre = new Calibre()

		const mobiFilePath = await calibre.ebookConvert(cbzFilePath, "mobi")

		return mobiFilePath
	}
}

export default EbookGeneratorService
