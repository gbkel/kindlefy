import puppeteer, { Browser, Page } from "puppeteer"

class BrowserService {
	private static browser: Browser

	async start (): Promise<void> {
		if (!BrowserService.browser) {
			BrowserService.browser = await puppeteer.launch({
				args: ["--no-sandbox", "--disable-setuid-sandbox"]
			})
		}
	}

	async getPage (): Promise<Page | null> {
		if (BrowserService.browser) {
			return await BrowserService.browser.newPage()
		} else {
			return null
		}
	}

	async close (): Promise<void> {
		if (BrowserService.browser) {
			await BrowserService.browser.close()
		}
	}
}

export default new BrowserService()
