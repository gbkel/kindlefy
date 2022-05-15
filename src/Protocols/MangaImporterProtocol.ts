export type MangaSearchResult = {
	path: string
	title: string
	coverUrl?: string
}

export type MangaChapterSearchResult = {
	no: number
	title: string
	createdAt: string
	getPagesFile: () => Promise<Buffer>
}

export type Manga = {
	title: string
	coverUrl?: string
	chapters: MangaChapterSearchResult[]
}

export interface MangaImporterContract {
	getManga: (name: string) => Promise<Manga>
}
