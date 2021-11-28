import mimetype from "mime-types"

import { ParsedFilePath } from "@/Protocols/FileProtocol"

class FileUtil {
	getMimetypeByFileName (filename: string): string | null {
		return mimetype.lookup(filename) || null
	}

	parseFilePath (filePath: string): ParsedFilePath {
		const fullname = filePath.split("/").pop()

		const [filename, extension] = fullname.split(".")

		return {
			fullname,
			filename,
			extension
		}
	}
}

export default new FileUtil()
