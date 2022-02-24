import {
	ManipulateArrayOptions,
	OrderByInput
} from "@/Protocols/DataManipulationProtocol"

class DataManipulationUtil {
	manipulateArray<Data>(array: Data[], options?: ManipulateArrayOptions<Data>): Data[] {
		let updatedArray = Array.from(array)

		if (options?.order) {
			updatedArray = updatedArray.sort(this.orderBy(options.order))
		}

		if (options?.limit) {
			updatedArray = updatedArray.slice(0, options.limit)
		}

		return updatedArray
	}

	private readonly orderBy = <Data>(input: OrderByInput<Data>) => (dataA: Data, dataB: Data) => {
		const {
			property,
			type
		} = input

		const dataAProperty = dataA[property] as any
		const dataBProperty = dataB[property] as any

		if (type === "asc") {
			return dataAProperty - dataBProperty
		} else if (type === "desc") {
			return dataBProperty - dataAProperty
		} else {
			return -1
		}
	}
}

export default new DataManipulationUtil()
