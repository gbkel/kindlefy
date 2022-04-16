import MangaImporterTool from "@/Tools/Importers/MangaImporterTool"

describe("MangaImporterTool", () => {
	describe("import()", () => {
		test("Should retrieve all 'One Piece' manga chapters with valid data", async () => {
			const manga = await MangaImporterTool.import({ type: "manga", name: "One Piece" })

			const chapterNumerations = manga.data.chapters.map(({ no }) => no)
			const lastChapterNumeration = Math.max(...chapterNumerations)
			const firstChapterNumeration = Math.min(...chapterNumerations)

			const areAllMangaChaptersValid = manga.data.chapters.every(chapter => (
				chapter.title && chapter.createdAt && chapter.no
			))

			expect(manga.data.title).toEqual("One Piece")
			expect(manga.data.chapters.length).toBeGreaterThanOrEqual(lastChapterNumeration - firstChapterNumeration)
			expect(areAllMangaChaptersValid).toBeTruthy()
		})
	})
})
