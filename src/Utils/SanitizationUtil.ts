import slugify from "slugify"

class SanitizationUtil {
	sanitizeFilename (filename: string): string {
		const params = filename.split(".")

		const extension = params.pop()

		const rawFilename = params.join(" ")
		const sanitizedFilename = slugify(rawFilename)

		const	result = `${sanitizedFilename}.${extension}`

		return result
	}
}

export default new SanitizationUtil()
