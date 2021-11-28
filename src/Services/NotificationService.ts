import task from "tasuku"

import {
	TaskCallback
} from "@/Protocols/NotificationProtocol"

class NotificationService {
	async task<Result extends unknown>(title: string, callback: TaskCallback<Result>): Promise<Result> {
		const runner = await task(title, async (taskConfig) => {
			try {
				return await callback(taskConfig)
			} catch (error) {
				taskConfig.setError(error.message)
			}
		})

		return runner.result
	}
}

export default new NotificationService()
