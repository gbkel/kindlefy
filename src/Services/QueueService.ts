import PQueue from "p-queue"

import { QueueOptions } from "@/Protocols/QueueProtocol"

class QueueService {
	private readonly queue: PQueue

	constructor (options: QueueOptions) {
		this.queue = new PQueue(options)
	}

	async enqueue<Result extends unknown>(callbackFn: () => Promise<Result>): Promise<Result> {
		return await this.queue.add(callbackFn)
	}
}

export default QueueService
