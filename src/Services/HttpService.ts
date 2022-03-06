import axios, { AxiosInstance } from "axios"
import { Readable } from "stream"

import { HttpOptions } from "@/Protocols/HttpProtocol"

class HttpService {
	private readonly client: AxiosInstance

	constructor (options: HttpOptions) {
		this.client = axios.create({
			baseURL: options.baseURL,
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"
			}
		})
	}

	async toBuffer (url: string): Promise<Buffer> {
		const result = await this.client.get(url, {
			responseType: "arraybuffer"
		})

		return result.data
	}

	async toString (url: string): Promise<string> {
		const result = await this.client.get(url)

		return result.data
	}

	async toJSON<Result extends Record<string, unknown>>(url: string): Promise<Result> {
		const result = await this.client.get(url, {
			responseType: "json"
		})

		return result.data
	}

	async toReadStream (url: string): Promise<Readable> {
		const result = await this.client.get(url, {
			responseType: "stream"
		})

		return result.data
	}

	async exists (url: string): Promise<boolean> {
		try {
			await this.client.head(url)

			return true
		} catch {
			return false
		}
	}
}

export default HttpService
