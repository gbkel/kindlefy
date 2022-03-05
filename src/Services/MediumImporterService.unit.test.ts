import MediumImporterService from "@/Services/MediumImporterService"

const MOCK_POST_NAME = "some_post"
const MOCK_NORMAL_POST_URL = `https://medium.com/@test/${MOCK_POST_NAME}`
const MOCK_SUBDOMAIN_POST_URL = `https://test.medium.com/${MOCK_POST_NAME}`
const MOCK_CUSTOM_POST_URL = `https://blog.test.dev/${MOCK_POST_NAME}`
const MOCK_INVALID_POST_URL = `https://<a href='test'>.com/${MOCK_POST_NAME}`
const MOCK_POST_JSON_URL = `https://medium.com/@/${MOCK_POST_NAME}?format=json`

const buildMockSeeMoreContent = (postUrl: string): string => `<a href="${postUrl}?source=rss">Continue reading on Medium »</a></p></div>`

describe("MediumImporterService", () => {
	describe("getPostUrlFromSeeMoreContent()", () => {
		test("Should retrieve post url from normal post url", async () => {
			const normalPostUrlSeeMoreContent = buildMockSeeMoreContent(MOCK_NORMAL_POST_URL)

			const postURL = MediumImporterService.getPostUrlFromSeeMoreContent(normalPostUrlSeeMoreContent)

			expect(postURL).toBe(MOCK_NORMAL_POST_URL)
		})

		test("Should retrieve post url from subdomain post url", async () => {
			const subdomainPostUrlSeeMoreContent = buildMockSeeMoreContent(MOCK_SUBDOMAIN_POST_URL)

			const postURL = MediumImporterService.getPostUrlFromSeeMoreContent(subdomainPostUrlSeeMoreContent)

			expect(postURL).toBe(MOCK_SUBDOMAIN_POST_URL)
		})

		test("Should retrieve post url from custom post url", async () => {
			const customPostUrlSeeMoreContent = buildMockSeeMoreContent(MOCK_CUSTOM_POST_URL)

			const postURL = MediumImporterService.getPostUrlFromSeeMoreContent(customPostUrlSeeMoreContent)

			expect(postURL).toBe(MOCK_CUSTOM_POST_URL)
		})

		test("Should not retrieve a post url from an invalid post url", async () => {
			const invalidPostUrlSeeMoreContent = buildMockSeeMoreContent(MOCK_INVALID_POST_URL)

			const postURL = MediumImporterService.getPostUrlFromSeeMoreContent(invalidPostUrlSeeMoreContent)

			expect(postURL).toBeFalsy()
		})
	})

	describe("turnPostUrlIntoPostJsonUrl()", () => {
		test("Should retrieve post json url from normal post url", async () => {
			const result = MediumImporterService.turnPostUrlIntoPostJsonUrl(MOCK_NORMAL_POST_URL)

			expect(result).toBe(MOCK_POST_JSON_URL)
		})

		test("Should retrieve post json url from subdomain post url", async () => {
			const result = MediumImporterService.turnPostUrlIntoPostJsonUrl(MOCK_SUBDOMAIN_POST_URL)

			expect(result).toBe(MOCK_POST_JSON_URL)
		})

		test("Should retrieve post json url from custom post url", async () => {
			const result = MediumImporterService.turnPostUrlIntoPostJsonUrl(MOCK_CUSTOM_POST_URL)

			expect(result).toBe(MOCK_POST_JSON_URL)
		})
	})
})
