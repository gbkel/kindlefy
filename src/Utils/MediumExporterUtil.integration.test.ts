import MediumExporterUtil from "@/Utils/MediumExporterUtil"

describe("MediumExporterUtil", () => {
	describe("getPostHTML()", () => {
		test("Should retrieve a post in HTML", async () => {
			const postHTML = await MediumExporterUtil.getPostHTML("https://medium.com/letalk/boas-pr%C3%A1ticas-de-arquitetura-de-c%C3%B3digo-b769d3ae0912")

			expect(postHTML).toBeTruthy()
		})
	})
})
