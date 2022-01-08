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
}
