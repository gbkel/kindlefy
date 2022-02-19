class ParseUtil {
	safelyParseArray<Data extends unknown>(value: string): Data[] {
		try {
			return JSON.parse(value)
		} catch {
			return []
		}
	}
}

export default new ParseUtil()
