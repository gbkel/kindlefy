import mimetype from "mime-types"

class FileUtil {
	getMimetypeByFileName (filename: string): string | null {
		return mimetype.lookup(filename) || null
	}
}

export default new FileUtil()
