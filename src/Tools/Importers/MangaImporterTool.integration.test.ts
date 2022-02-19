import MangaImporterTool from "@/Tools/Importers/MangaImporterTool"

describe("MangaImporterTool", () => {
	describe("import()", () => {
		test("Should retrieve 'One Piece' manga with last chapter by default", async () => {
			const manga = await MangaImporterTool.import({ type: "manga", name: "One Piece" })

			expect(manga.data).toBeTruthy()
			expect(manga.data.title).toEqual("One Piece")
			expect(manga.data.chapters.length).toBe(1)
			expect(manga.data.chapters[0].title).toBeTruthy()
			expect(manga.data.chapters[0].createdAt).toBeTruthy()
			expect(manga.data.chapters[0].no).toBeTruthy()
			expect(manga.data.chapters[0].pagesFileUrl).toBeTruthy()
		})
	})
})
