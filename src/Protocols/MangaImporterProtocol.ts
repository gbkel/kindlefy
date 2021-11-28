export type MangaSearchResult = {
	path: string
	title: string
}

export type MangaChapterSearchResult = {
	no: number
	title: string
	createdAt: string
	pagesFileUrl: string
}

export type Manga = {
	title: string
	chapters: MangaChapterSearchResult[]
}
