import archiver, { Archiver } from "archiver"
import { Writable } from "stream"

import { AppendInput } from "@/Protocols/CompressionProtocol"

class CompressionService {
	private readonly archiver: Archiver

	constructor () {
		this.archiver = archiver("zip", {
			zlib: {
				level: 1
			},
			highWaterMark: 4 * 512 * 1024
		})
	}

	pipe (writableStream: Writable): void {
		this.archiver.pipe(writableStream)
	}

	addFile (input: AppendInput): void {
		const { data, fileName } = input

		this.archiver.append(data, { name: fileName })
	}

	async compress (): Promise<void> {
		await this.archiver.finalize()
	}
}

export default CompressionService
