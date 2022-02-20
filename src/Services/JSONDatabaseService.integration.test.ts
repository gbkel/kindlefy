import crypto from "crypto"

import JSONDatabaseService from "@/Services/JSONDatabaseService"
import TempFolderService from "@/Services/TempFolderService"

type MockData = {
	id: string
	name: string
}

const generateMockData = (count: number): Record<string, MockData> => {
	const mockData: Record<string, MockData> = {}

	for (let index = 0; index < count; index++) {
		const id = crypto.randomUUID()

		mockData[id] = {
			id,
			name: `test-${index}`
		}
	}

	return mockData
}

describe("JSONDatabaseService", () => {
	describe("set()", () => {
		test("Make sure concurrent changes do not corrupt database", async () => {
			const mockData = generateMockData(10)

			const databaseName = `json-database-service-integration-test-${crypto.randomUUID()}.json`
			const databaseFullPath = TempFolderService.mountTempPath(databaseName)

			const jsonDatabaseService = new JSONDatabaseService<MockData>(databaseFullPath)

			await Promise.all(
				Object.values(mockData).map(async data => (
					await jsonDatabaseService.set(data.id, data)
				))
			)

			const fullDatabase = await jsonDatabaseService.dumpFileDatabaseToDeserialized()

			expect(mockData).toEqual(fullDatabase)
		})
	})
})
