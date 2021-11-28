import task from "tasuku"

import {
	TaskCallback
} from "@/Protocols/NotificationProtocol"

import ErrorHandlerService from "@/Services/ErrorHandlerService"

class NotificationService {
	async task<Result extends unknown>(title: string, callback: TaskCallback<Result>): Promise<Result> {
		try {
			const runner = await task(title, async (taskConfig) => {
				try {
					return await callback(taskConfig)
				} catch (error) {
					console.log(error)
					taskConfig.setError(error.message || "Something went wrong")
				}
			})

			return runner.result
		} catch (error) {
			ErrorHandlerService.handle(error)
		}
	}
}

export default new NotificationService()
