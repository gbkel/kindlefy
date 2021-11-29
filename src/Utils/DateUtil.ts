class DateUtil {
	private readonly dateFormatter = new Intl.DateTimeFormat()

	/**
	 * Returns date in MM-DD-YYYY format based on the current locale.
	 */
	formatDate (date: Date): string {
		const formattedDate = this.dateFormatter.format(date)?.replace(/\//g, "-")

		return formattedDate
	}

	get todayFormattedDate (): string {
		const today = new Date()

		return this.formatDate(today)
	}
}

export default new DateUtil()
