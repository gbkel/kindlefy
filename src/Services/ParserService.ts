import RSSParser from "rss-parser"
import cheerio, { CheerioAPI } from "cheerio"

import { ParsedRSS } from "@/Protocols/ParserProtocol"

class ParserService {
	async parseRSS (rss: string): Promise<ParsedRSS> {
		const rssParser = new RSSParser()

		const rawParsedRSS = await rssParser.parseString(rss)

		const parsedRSS: ParsedRSS = {
			title: rawParsedRSS?.title,
			author: rawParsedRSS?.author,
			creator: rawParsedRSS?.creator,
			imageUrl: rawParsedRSS?.image?.url,
			items: rawParsedRSS?.items?.map(item => ({
				title: item?.title,
				creator: item?.creator,
				content: item?.content
			}))
		}

		return parsedRSS
	}

	parseHTML (html: string): CheerioAPI {
		const $ = cheerio.load(html)

		return $
	}
}

export default ParserService
