export type ParsedRSS = {
	title: string
	author: string
	creator: string
	imageUrl: string
	items: ParsedRSSItem[]
}

export type ParsedRSSItem = {
	title: string
	creator: string
	content: string
	publishDate: string
	rawData: Record<string, unknown>
}
