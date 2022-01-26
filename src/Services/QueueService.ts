import PQueue from "p-queue"
import PRetry from "p-retry"

import { QueueOptions } from "@/Protocols/QueueProtocol"

import TimeUtil from "@/Utils/TimeUtil"

class QueueService {
	private readonly queue: PQueue
	private readonly options: QueueOptions

	constructor (options: QueueOptions) {
		this.queue = new PQueue(options)

		this.options = options
	}

	async enqueue<Result extends unknown>(callbackFn: () => Promise<Result>): Promise<Result> {
		return await this.queue.add(async () => {
			return await PRetry(callbackFn, {
				onFailedAttempt: async () => {
					if (this.options.retryDelay) {
						await TimeUtil.wait(this.options.retryDelay)
					}
				},
				retries: this.options.retries
			})
		})
	}
}

export default QueueService
