export type TaskConfig = {
	setError: (error: string) => void
	setOutput: (output: string) => void
	setStatus: (status: string) => void
	setWarning: (warning: string) => void
}

export type TaskCallback<Result extends unknown> = (config: TaskConfig) => Promise<Result>
