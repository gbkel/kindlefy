import task from "tasuku"
import * as core from "@actions/core"

import {
	TaskCallback
} from "@/Protocols/NotificationProtocol"

import ErrorHandlerService from "@/Services/ErrorHandlerService"

class NotificationService {
	async task<Result extends unknown>(title: string, callback: TaskCallback<Result>): Promise<Result> {
		const isGithubActionContext = Boolean(core.getInput("kindle_email"))

		if (isGithubActionContext) {
			return await this.githubActionTask(title, callback)
		} else {
			return await this.CLITask(title, callback)
		}
	}

	private async CLITask<Result extends unknown>(title: string, callbackFn: TaskCallback<Result>): Promise<Result> {
		try {
			const runner = await task(title, async (taskConfig) => {
				try {
					return await callbackFn(taskConfig)
				} catch (error) {
					taskConfig.setError(error.message || error)
				}
			})

			return runner.result
		} catch (error) {
			ErrorHandlerService.handle(error)
		}
	}

	private async githubActionTask<Result extends unknown>(title: string, callbackFn: TaskCallback<Result>): Promise<Result> {
		try {
			core.info(title)

			return await callbackFn({
				setError: (error) => core.error(error),
				setOutput: (output) => core.debug(output),
				setStatus: (status) => core.debug(status),
				setWarning: (warning) => core.warning(warning)
			})
		} catch (error) {
			core.error(error.message || error)
		}
	}
}

export default new NotificationService()
