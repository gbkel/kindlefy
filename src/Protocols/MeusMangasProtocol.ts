export type MeusMangasSearchResult = {
	title: string
	url: string
	author: string
	img: string
}

export type RawChapterPicture = {
	url: string
	order: number
}

export type RawChapter = {
	no: number
	date: string
	path: string
}
