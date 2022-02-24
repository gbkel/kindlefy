export type ParsedRSS = {
	title: string
	author: string
	creator: string
	imageUrl: string
	items: Array<{
		title: string
		creator: string
		content: string
		publishDate: string
	}>
}
