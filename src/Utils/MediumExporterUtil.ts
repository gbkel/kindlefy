import { URL } from "url"

import HttpService from "@/Services/HttpService"

import {
	PostIFrame,
	PostJSONResponse,
	IFrameJSONResponse,
	GistJSONResponse,
	PostParagraph,
	RenderedParagraph
} from "@/Protocols/MediumExporterProtocol"

/**
 * Credits to:
 * 	- https://github.com/iagocavalcante/api-postagens
 */
class MediumExporterUtil {
	private readonly httpService: HttpService = new HttpService({})

	private readonly tagReplaceMap = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;"
	}

	private readonly paragraphTypeTagMap = {
		0: "<p>_$_</p>",
		1: "<p>_$_</p>",
		3: "<h1>_$_</h1>",
		4: "<img width=\"100%\" src=\"https://miro.medium.com/max/1400/_$_\" />",
		6: "<blockquote>_$_</blockquote>",
		7: "<blockquote>_$_</blockquote>",
		8: "<pre>_$_</pre>",
		9: "<li><a href=\"_$_\">_%_</a></li>",
		10: "<ol>_$_</ol>",
		11: "<iframe width=\"100%\" src=\"_$_\"></iframe>",
		13: "<h2>_$_</h2>",
		14: "<a href=\"_$_\">_%_</a>"
	}

	async getPostHTML (postUrl: string): Promise<string> {
		const postJsonUrl = this.turnPostUrlIntoPostJsonUrl(postUrl)

		const rawPostResponse = await this.httpService.toString(postJsonUrl)

		const postJSON = this.turnRawResponseIntoJSON<PostJSONResponse>(rawPostResponse)

		const renderedParagraphs = await Promise.all(
			postJSON.value.content.bodyModel.paragraphs.map(async paragraph => (
				await this.renderParagraph(paragraph)
			))
		)

		const postHTML = this.turnRenderedParagraphsIntoHTML(renderedParagraphs)

		return postHTML
	}

	getPostUrlFromSeeMoreContent (content: string): string {
		/**
		 * Matches post urls such as:
		 * 	- https://something.medium.com/some-post?source=rss
		 * 	- https://medium.com/some-post?source=rss
		 *
		 */
		const rawPostUrl = content.match(/https:\/\/([a-zA-Z-]*?)(\.?)medium\.com(.*?)\?source=rss/g)

		const formattedPostUrl = rawPostUrl?.[0]?.replace("?source=rss", "")

		return formattedPostUrl
	}

	private turnRenderedParagraphsIntoHTML (paragraphs: RenderedParagraph[]): string {
		const html = paragraphs.reduce((html, paragraph) => {
			const isLinkTag = paragraph.tag.includes("<a")

			if (isLinkTag) {
				html += `${paragraph.tag.replace("_$_", paragraph?.mixtapeMetadata?.href).replace("_%_", paragraph.text)}`

				return html
			}

			const isImgTag = paragraph.tag.includes("<img")

			if (isImgTag) {
				html += `${paragraph.tag.replace("_$_", paragraph?.metadata?.id)}`

				return html
			}

			const isIframeTag = paragraph.tag.includes("<iframe")

			if (isIframeTag) {
				html += `<link rel="stylesheet" href="${paragraph?.gist?.stylesheet}"></link>`
				html += paragraph.gist.div

				return html
			}

			html += `${paragraph.tag.replace("_$_", paragraph.text)}`

			return html
		}, "")

		return html
	}

	private turnPostUrlIntoPostJsonUrl (postUrl: string): string {
		const url = new URL(postUrl)

		const params = {
			slug: "",
			postName: ""
		}

		const subdomainSlug = url.hostname.split("medium.com")?.[0]?.replace(".", "")

		if (subdomainSlug) {
			const [, postName] = url.pathname.split("/")

			params.slug = subdomainSlug
			params.postName = postName
		} else {
			const [, slug, postName] = url.pathname.split("/")

			params.slug = slug
			params.postName = postName
		}

		const postJsonUrl = `https://medium.com/@${params.slug}/${params.postName}?format=json`

		return postJsonUrl
	}

	private turnRawResponseIntoJSON<Response extends unknown>(rawPostResponse: string): Response {
		const sanitizedResponse = rawPostResponse?.replace("])}while(1);</x>", "")

		const jsonResponse = JSON.parse(sanitizedResponse)

		return jsonResponse.payload
	}

	private async turnPostIframeIntoIframeContent (iframe: PostIFrame): Promise<IFrameJSONResponse["value"]> {
		const rawResponse = await this.httpService.toString(`https://medium.com/media/${iframe.mediaResourceId}`)

		const JSONResponse = this.turnRawResponseIntoJSON<IFrameJSONResponse>(rawResponse)

		return JSONResponse.value
	}

	private async turnIframeContentIntoGistContent (iframe: IFrameJSONResponse["value"]): Promise<GistJSONResponse> {
		const url = `https://${iframe.domain}/${iframe.gist.gistId}.json`

		return await this.httpService.toJSON(url)
	}

	private async renderParagraph (paragraph: PostParagraph): Promise<RenderedParagraph> {
		const renderedParagraph: RenderedParagraph = {
			text: paragraph.text || "",
			tag: this.checkType(paragraph.type),
			mixtapeMetadata: paragraph.mixtapeMetadata,
			markups: paragraph.markups,
			metadata: paragraph.metadata
		}

		if (paragraph.iframe) {
			renderedParagraph.iframe = await this.turnPostIframeIntoIframeContent(paragraph.iframe)
			renderedParagraph.gist = await this.turnIframeContentIntoGistContent(renderedParagraph.iframe)
		}

		if (paragraph.type === 8) {
			paragraph.text = this.safeTagsReplace(paragraph.text)
		}

		return renderedParagraph
	}

	private replaceTag (tag: string): string {
		return this.tagReplaceMap[tag] || tag
	}

	private safeTagsReplace (value: string): string {
		return value.replace(/[&<>]/g, tag => this.replaceTag(tag))
	}

	private checkType (type: number): string {
		return this.paragraphTypeTagMap[type]
	}
}

export default new MediumExporterUtil()
