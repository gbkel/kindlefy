class SanitizationUtil {
	sanitizeFilename (rawFilename: string): string {
		return rawFilename.replace(/[^a-zA-Z0-9 \.]/g, "")
	}
}

export default new SanitizationUtil()
