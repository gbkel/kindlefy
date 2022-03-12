export type FindElementsInput = {
	html: string
	selector: string
}

export type Element = {
	attribs: {
		class: string
		href: string
	}
	type: "text"
	data: string
	name: "a" | "td"
	lastChild: Element
	children: Element[]
}
