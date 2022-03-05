import MediumImporterService from "@/Services/MediumImporterService"

describe("MediumImporterService", () => {
	describe("getPostHTML()", () => {
		test("Should retrieve a post in HTML", async () => {
			const postHTML = await MediumImporterService.getPostHTML("https://medium.com/letalk/boas-pr%C3%A1ticas-de-arquitetura-de-c%C3%B3digo-b769d3ae0912")

			expect(postHTML).toBeTruthy()
		})

		test("Should throw when trying to retrieve an invalid post in HTML", async () => {
			const promise = MediumImporterService.getPostHTML("https://medium.com/invalid_slug/invalid_post_name")

			await expect(promise).rejects.toThrow()
		})
	})
})
