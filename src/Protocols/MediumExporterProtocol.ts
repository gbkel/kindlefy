export type PostIFrame = IFrameJSONResponse["value"]

export type PostParagraphMarkup = {
	type: number
	start: number
	end: number
	href: string
	title: string
	anchorType: number
}

export type PostParagraphMetadata = {
	id: string
	originalWidth: number
	originalHeight: number
}

export type PostParagraphMixtapeMetadata = {
	href: string
}

export type PostParagraph = {
	name: string
	type: number
	text: string
	iframe: PostIFrame
	markups: PostParagraphMarkup[]
	metadata: PostParagraphMetadata
	mixtapeMetadata: PostParagraphMixtapeMetadata
}

export type PostJSONResponse = {
	value: {
		id: string
		title: string
		content: {
			subtitle: string
			bodyModel: {
				paragraphs: PostParagraph[]
			}
		}
	}
}

export type IFrameJSONResponse = {
	value: {
		mediaResourceId: string
		domain: string
		gist: {
			gistId: string
		}
	}
}

export type GistJSONResponse = {
	description: string
	created_at: string
	owner: string
	div: string
	stylesheet: string
}

export type RenderedParagraph = {
	text: string
	tag: string
	iframe?: IFrameJSONResponse["value"]
	gist?: GistJSONResponse
	mixtapeMetadata?: PostParagraphMixtapeMetadata
	markups?: PostParagraphMarkup[]
	metadata?: PostParagraphMetadata
}
