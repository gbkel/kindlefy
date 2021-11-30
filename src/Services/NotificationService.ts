import task from "tasuku"
import * as core from "@actions/core"

import {
	TaskCallback, TaskConfig
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
		const taskConfig: TaskConfig = {
			setError: (error) => core.info(`[${title}] ❌ ${error}`),
			setOutput: (output) => core.info(`[${title}] ✔️ ${output}`),
			setStatus: (status) => core.info(`[${title}] 🔔 ${status}`),
			setWarning: (warning) => core.info(`[${title}] ⚠️ ${warning}`),
			setTitle: (title) => core.info(`💎 ${title}`)
		}

		try {
			taskConfig.setTitle(title)

			return await callbackFn(taskConfig)
		} catch (error) {
			taskConfig.setError(error.message || error)
		}
	}
}

export default new NotificationService()
