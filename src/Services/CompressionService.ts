import archiver, { Archiver } from "archiver"

class CompressionService {
	get zip (): Archiver {
		return archiver("zip", {
			zlib: {
				level: 1
			},
			highWaterMark: 4 * 512 * 1024
		})
	}
}

export default new CompressionService()
