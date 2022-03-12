import RSSParser from "rss-parser"

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
				content: item?.content,
				publishDate: item?.pubDate,
				rawData: item
			}))
		}

		return parsedRSS
	}
}

export default ParserService
