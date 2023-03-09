export type MangaReaderSearchResult = {
	manga: [{
		all: Array<{
			ID: number
			post_image: string
			post_link: string
			post_title: string
		}>
	}]
}

export type RawChapter = {
	no: number
	path: string
}

export type RawChapterPicture = {
	url: string
	order: number
}
