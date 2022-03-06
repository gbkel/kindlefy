import task from "tasuku"
import * as core from "@actions/core"
import style from "ansi-styles"

import {
	TaskCallback, TaskConfig
} from "@/Protocols/NotificationProtocol"

import ErrorHandlerService from "@/Services/ErrorHandlerService"

import EnvironmentValidation from "@/Validations/EnvironmentValidation"

class NotificationService {
	async task<Result extends unknown>(title: string, callback: TaskCallback<Result>): Promise<Result> {
		if (EnvironmentValidation.isGithubActionEnvironment) {
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
					taskConfig.setError(error)
				}
			})

			return runner.result
		} catch (error) {
			ErrorHandlerService.handle(error)
		}
	}

	private async githubActionTask<Result extends unknown>(title: string, callbackFn: TaskCallback<Result>): Promise<Result> {
		const taskConfig: TaskConfig = {
			setError: (error) => core.info(`${style.color.red.open}❌ ${error}${style.color.red.close}`),
			setOutput: (output) => core.info(`${style.color.green.open}✔️ ${output}${style.color.green.close}`),
			setStatus: (status) => core.info(`${style.color.gray.open}🔔 ${status}${style.color.gray.close}`),
			setWarning: (warning) => core.info(`${style.color.yellow.open}⚠️ ${warning}${style.color.yellow.close}`)
		}

		try {
			const result = await core.group(`💎 ${title}`, async () => {
				try {
					return await callbackFn(taskConfig)
				} catch (error) {
					taskConfig.setError(error)
				}
			})

			return result
		} catch (error) {
			ErrorHandlerService.handle(error)
		}
	}
}

export default new NotificationService()
