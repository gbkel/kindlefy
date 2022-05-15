export type EpubContent = {
	title: string
	author: string
	data: string
}

export type GenerateEPUBOptions = {
	title: string
	author: string
	publisher: string
	cover: string
	content: EpubContent[]
	metadata: {
		title: string
		subTitle: string
	}
}

/**
 * More options can be found here:
 * - http://manpages.ubuntu.com/manpages/bionic/man1/ebook-convert.1.html
 */
export type EbookConvertOptions = {
	/**
	 * Do not resize images, useful for showing .CBZ images
	 * with the greater size possible.
	 */
	outputProfile?: "tablet"
	/**
	 * When splitting a .CBZ landscape image, gets the right splitted image
	 * in front of the left one. This is useful for splitting manga landscape images.
	 */
	right2left?: boolean
	/**
	 * Disable automatically created table of contents.
	 */
	noInlineToc?: boolean
	/**
	 * Disable splitting landscape pages into two pages for comics.
	 */
	landscape?: boolean
	/**
	 * Sets the info about the ebook authors, usually shown on ebook listing
	 * on kindle.
	 */
	authors?: string
	/**
	 * Indicates a custom cover for ebook by some path or link.
	 */
	cover?: string
}
