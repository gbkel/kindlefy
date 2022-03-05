import { Element } from "cheerio"

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
				const childSelectedElement = this.getElementByClassName(child as Element, selectedClass)

				if (childSelectedElement) {
					selectedElement = childSelectedElement
				}
			})
		}

		return selectedElement
	}
}

export default new CrawlerService()
