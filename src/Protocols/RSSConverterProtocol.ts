export type EbookConfigContent = {
	title: string
	author: string
	data: string
}

export type EbookConfig = {
	title: string
	author: string
	publisher: string
	cover: string
	content: EbookConfigContent[]
}
