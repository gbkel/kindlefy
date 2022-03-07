import axios from "axios"

class HttpProxy {
	async get (url: string): Promise<string> {
		const allOriginsProxyUrl = "https://api.allorigins.win/get"

		const result = await axios.get(allOriginsProxyUrl, {
			params: {
				url
			}
		})

		return result.data.contents
	}
}

export default new HttpProxy()
