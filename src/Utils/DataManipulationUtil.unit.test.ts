import DataManipulationUtil from "@/Utils/DataManipulationUtil"

type MockData = {
	id: number
}

const generateMockData = (count: number): MockData[] => {
	const mockData: MockData[] = []

	for (let index = 0; index < count; index++) {
		mockData.push({
			id: index
		})
	}

	return mockData
}

describe("DataManipulationUtil", () => {
	describe("manipulateArray()", () => {
		test("Should execute 'ordering' before 'limiting'", async () => {
			const mockData = generateMockData(10)

			const manipulatedData = DataManipulationUtil.manipulateArray(mockData, {
				order: { property: "id", type: "desc" },
				limit: 3
			})

			expect(manipulatedData[0].id).toBe(9)
			expect(manipulatedData[1].id).toBe(8)
			expect(manipulatedData[2].id).toBe(7)
		})

		test("Should have correct length when using 'limiting'", async () => {
			const mockData = generateMockData(10)

			const manipulatedData = DataManipulationUtil.manipulateArray(mockData, {
				limit: 3
			})

			expect(manipulatedData.length).toBe(3)
		})
	})
})
