export type GenerateEPUBOptions = {
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
