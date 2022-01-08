import MediumExporterUtil from "@/Utils/MediumExporterUtil"

export const MEDIUM_SEE_MORE_CONTENT_EXAMPLE = "<div class=\"medium-feed-item\"><p class=\"medium-feed-image\"><a href=\"https://medium.com/@thcerutti/cooktop-componentes-de-software-e-o-princ%C3%ADpio-da-responsabilidade-%C3%BAnica-81c28a1a384a?source=rss------software_engineering-5\"><img src=\"https://cdn-images-1.medium.com/max/930/1*8XQJDE-oism_dzoMPjsuoA.png\" width=\"930\"></a></p><p class=\"medium-feed-snippet\">Meu cooktop bugou. N&#xE3;o, n&#xE3;o estou falando de algum padr&#xE3;o de projeto chamado &#x201C;cooktop&#x201D; (&#x2026;), foi o da minha cozinha mesmo. Bugou bugado.</p><p class=\"medium-feed-link\"><a href=\"https://medium.com/@thcerutti/cooktop-componentes-de-software-e-o-princ%C3%ADpio-da-responsabilidade-%C3%BAnica-81c28a1a384a?source=rss------software_engineering-5\">Continue reading on Medium »</a></p></div>"

describe("MediumExporterUtil", () => {
	describe("getPostUrlFromSeeMoreContent()", () => {
		test("Should retrieve original post url from see more content", async () => {
			const postURL = MediumExporterUtil.getPostUrlFromSeeMoreContent(MEDIUM_SEE_MORE_CONTENT_EXAMPLE)

			expect(postURL).toBeTruthy()
		})
	})
})
