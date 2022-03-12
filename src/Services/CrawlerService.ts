import cheerio from "cheerio"

import {
	FindElementsInput,
	Element
} from "@/Protocols/CrawlerProtocol"

class CrawlerService {
	getElementByClassName (currentElement: Element, selectedClass: string): Element {
		let selectedElement: any

		const currentElementClasses = currentElement?.attribs?.class || ""

		const currentElementHasSelectedClass = currentElementClasses?.includes(selectedClass)

		if (currentElementHasSelectedClass) {
			selectedElement = currentElement
		} else {
			const children = currentElement?.children || []

			children.forEach((child) => {
				const childSelectedElement = this.getElementByClassName(child, selectedClass)

				if (childSelectedElement) {
					selectedElement = childSelectedElement
				}
			})
		}

		return selectedElement
	}

	findElements (input: FindElementsInput): Element[] {
		const { html, selector } = input

		const $ = cheerio.load(html)

		const elements = $(selector).toArray() as any

		return elements
	}
}

export default new CrawlerService()
