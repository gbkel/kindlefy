import fs from "fs"

import { Database } from "@/Protocols/JSONDatabaseProtocol"

import QueueService from "@/Services/QueueService"

class JSONDatabaseService<Model extends unknown> {
	private static databases: Record<string, Database> = {}
	/**
	 * Since there can be multiple instances of this class accessing the same file,
	 * we control all the actions by using a fifo queue, to make sure there will be
	 * no concurrency able to cause bugs.
	 */
	private static readonly actionFIFOQueue = new QueueService({ concurrency: 1 })
	private readonly path: string

	constructor (path: string) {
		this.path = path
	}

	async set (key: string, value: Model): Promise<void> {
		return await JSONDatabaseService.actionFIFOQueue.enqueue(async () => {
			await this.syncInMemoryDatabaseByFileDatabaseIfNotAlreadySync()

			JSONDatabaseService.databases[this.path][key] = value

			await this.refreshFileDatabaseFromInMemoryDatabase()
		})
	}

	async get (key: string): Promise<Model | null> {
		return await JSONDatabaseService.actionFIFOQueue.enqueue(async () => {
			await this.syncInMemoryDatabaseByFileDatabaseIfNotAlreadySync()

			const data = JSONDatabaseService.databases[this.path][key]

			if (data) {
				return data as Model
			} else {
				return null
			}
		})
	}

	async dumpFileDatabaseToBuffer (): Promise<Buffer> {
		const databaseBuffer = await fs.promises.readFile(this.path)

		return databaseBuffer
	}

	async dumpFileDatabaseToDeserialized (): Promise<Database> {
		const serializedDatabase = await fs.promises.readFile(this.path, { encoding: "utf-8" })

		return this.deserialize<Database>(serializedDatabase)
	}

	private serialize<Data extends unknown>(data: Data): string {
		return JSON.stringify(data, undefined, "\t")
	}

	private deserialize<Data extends unknown>(serializedData: string): Data {
		return JSON.parse(serializedData)
	}

	private async refreshFileDatabaseFromInMemoryDatabase (): Promise<void> {
		const serializedDatabase = this.serialize(JSONDatabaseService.databases[this.path])

		await fs.promises.writeFile(this.path, serializedDatabase)
	}

	private async syncInMemoryDatabaseByFileDatabaseIfNotAlreadySync (): Promise<void> {
		const isDatabaseReady = Boolean(JSONDatabaseService.databases[this.path])

		if (isDatabaseReady) {
			return
		}

		await this.syncInMemoryDatabaseByFileDatabase()
	}

	private async syncInMemoryDatabaseByFileDatabase (): Promise<void> {
		try {
			JSONDatabaseService.databases[this.path] = await this.dumpFileDatabaseToDeserialized()
		} catch {
			JSONDatabaseService.databases[this.path] = {}
		}
	}
}

export default JSONDatabaseService
