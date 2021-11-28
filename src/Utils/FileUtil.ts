import mimetype from "mime-types"
import path from "path"

import { ParsedFilePath } from "@/Protocols/FileProtocol"

class FileUtil {
	getMimetypeByFileName (filename: string): string | null {
		return mimetype.lookup(filename) || null
	}

	parseFilePath (filePath: string): ParsedFilePath {
		const fullname = path.basename(filePath)

		const [filename, extension] = fullname.split(".")

		return {
			fullname,
			filename,
			extension
		}
	}
}

export default new FileUtil()
