import task from "tasuku"

import {
	TaskCallback
} from "@/Protocols/NotificationProtocol"

class NotificationService {
	async task<Result extends unknown>(title: string, callback: TaskCallback<Result>): Promise<Result> {
		const runner = await task(title, async (taskConfig) => await callback(taskConfig))

		return runner.result
	}
}

export default new NotificationService()
