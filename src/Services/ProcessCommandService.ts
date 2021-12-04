import { exec, ExecOptions } from "child_process"

class ProcessCommandService {
	private readonly execOptions: ExecOptions = {
		maxBuffer: 2000 * 1024
	}

	async run (command: string, args: string[] = [], options: Record<string, unknown> = {}): Promise<string> {
		const formattedArguments = this.formatArguments(args)
		const formattedOptions = this.formatOptions(options)

		/**
		 * WARNING: Make sure to add arguments first since some CLI commands
		 * only allow them to come first and options in the last.
		 */
		const execList = [command, ...formattedArguments, ...formattedOptions]

		const execString = execList.join(" ")

		return await this.exec(execString)
	}

	private async exec (command: string, options: ExecOptions = {}): Promise<string> {
		return await new Promise((resolve, reject) => {
			const mergedOptions = {
				...this.execOptions,
				...options
			}

			exec(command, mergedOptions, (error, stdout, stderr) => {
				if (error) {
					reject(error)
				} else if (stderr) {
					reject(stderr)
				} else {
					resolve(stdout)
				}
			}
			)
		})
	}

	private turnCamelCaseIntoKebabCase (string: string): string {
		return string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
	}

	private formatOptions (options: Record<string, unknown>): string[] {
		const formattedOptions = Object.entries(options).map(([key, value]) => {
			key = this.turnCamelCaseIntoKebabCase(key)

			/**
			 * Support options that can have multiple values.
			 * `field: ['a','b','c']` -> `--field "a" --field "b" --field "c"`
			 */
			const listValues = Array.isArray(value) ? value : [value]

			const commandList = listValues.map((value: string) => {
				let option = ""

				/**
					 * Convert 's' to '-s', 'search' to '--search'
					 */
				if (key.length === 1) {
					option = `-${key}`
				} else {
					option = `--${key}`
				}

				const isValidValue = value !== null
				const isBooleanValue = typeof value === "boolean"
				const optionNeedsValue = isValidValue && !isBooleanValue

				if (optionNeedsValue) {
					option += ` "${escape(value)}"`
				}

				return option
			})

			const commandString = commandList.join(" ")

			return commandString
		})

		return formattedOptions
	}

	private formatArguments (args: string[]): string[] {
		const formattedArguments = args.map(arg => `"${arg}"`)

		return formattedArguments
	}
}

export default new ProcessCommandService()
