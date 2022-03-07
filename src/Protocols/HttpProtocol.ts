export type HttpOptions = {
	baseURL?: string
	/**
	 * Useful for requests that can be different when you are doing
	 * them inside an automation service. So it is usually blocked by
	 * the website.
	 */
	withProxy?: boolean
}
