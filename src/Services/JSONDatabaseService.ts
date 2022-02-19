import fs from "fs"

import { Database } from "@/Protocols/JSONDatabaseProtocol"

import QueueService from "@/Services/QueueService"

class JSONDatabaseService<Model extends unknown> {
	private static databases: Record<string, Database> = {}
	private static readonly actionFIFOQueue = new QueueService({ concurrency: 1 })
	private readonly path: string

	constructor (path: string) {
		this.path = path
	}

	async set (key: string, value: Model): Promise<void> {
		return await JSONDatabaseService.actionFIFOQueue.enqueue(async () => {
			await this.setupDatabase()

			JSONDatabaseService.databases[this.path][key] = value

			await this.refreshDatabase()
		})
	}

	async get (key: string): Promise<Model | null> {
		return await JSONDatabaseService.actionFIFOQueue.enqueue(async () => {
			await this.setupDatabase()

			const data = JSONDatabaseService.databases[this.path][key]

			if (data) {
				return data as Model
			} else {
				return null
			}
		})
	}

	async dump (): Promise<Buffer> {
		const database = await fs.promises.readFile(this.path)

		return database
	}

	private serialize<Data extends unknown>(data: Data): string {
		return JSON.stringify(data, undefined, "\t")
	}

	private deserialize<Data extends unknown>(serializedData: string): Data {
		return JSON.parse(serializedData)
	}

	private async refreshDatabase (): Promise<void> {
		const serializedDatabase = this.serialize(JSONDatabaseService.databases[this.path])

		await fs.promises.writeFile(this.path, serializedDatabase)
	}

	private async setupDatabase (): Promise<void> {
		const isDatabaseSetup = Boolean(JSONDatabaseService.databases[this.path])

		if (isDatabaseSetup) {
			return
		}

		try {
			const serializedDatabase = await fs.promises.readFile(this.path, {
				encoding: "utf-8"
			})

			JSONDatabaseService.databases[this.path] = this.deserialize<Database>(serializedDatabase)
		} catch {
			JSONDatabaseService.databases[this.path] = {}
		}
	}
}

export default JSONDatabaseService
