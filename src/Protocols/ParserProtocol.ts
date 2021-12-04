export type ParsedRSS = {
	title: string
	author: string
	creator: string
	imageUrl: string
	items: Array<{
		title: string
		creator: string
		content: string
	}>
}

export type ParseEPUBOptions = {
	title: string
	author: string
	publisher: string
	cover: string
	content: Array<{
		title: string
		author: string
		data: string
	}>
}
