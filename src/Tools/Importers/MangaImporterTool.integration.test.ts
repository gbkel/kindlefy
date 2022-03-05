import MangaImporterTool from "@/Tools/Importers/MangaImporterTool"

import TempFolderService from "@/Services/TempFolderService"

describe("MangaImporterTool", () => {
	beforeAll(async () => {
		TempFolderService.generate()
	})

	describe("import()", () => {
		test("Should retrieve all 'One Piece' manga chapters with valid data", async () => {
			const manga = await MangaImporterTool.import({ type: "manga", name: "One Piece" })

			expect(manga.data).toBeTruthy()
			expect(manga.data.title).toEqual("One Piece")
			expect(manga.data.chapters.length).toBeGreaterThan(0)

			const areAllMangaChaptersValid = manga.data.chapters.every(chapter => (
				chapter.title && chapter.createdAt && chapter.no
			))

			expect(areAllMangaChaptersValid).toBeTruthy()
		})
	})
})
