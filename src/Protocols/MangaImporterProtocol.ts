export type MangaSearchResult = {
	path: string
	title: string
}

export type MangaChapterSearchResult = {
	no: number
	title: string
	createdAt: string
	getPagesFile: () => Promise<Buffer>
}

export type Manga = {
	title: string
	chapters: MangaChapterSearchResult[]
}

export interface MangaImporterContract {
	getManga: (name: string) => Promise<Manga>
}
