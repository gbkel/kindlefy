import HttpProxyService from "@/Services/HttpProxyService"

describe("HttpProxyService", () => {
	describe("get()", () => {
		test("Should retrieve a HTML page content", async () => {
			const postHTML = await HttpProxyService.get("https://google.com")

			expect(postHTML).toBeTruthy()
		})
	})
})
