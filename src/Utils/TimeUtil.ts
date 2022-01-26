class TimeUtil {
	async wait (millisecondsToWait: number): Promise<void> {
		await new Promise(resolve => setTimeout(resolve, millisecondsToWait))
	}
}

export default new TimeUtil()
