import ArrayUtil from "@/Utils/ArrayUtil"

import { IterateCallback } from "@/Protocols/MapProtocol"

class MapUtil {
	async iterate<Result>(count: number, callback: IterateCallback<Result>): Promise<Result[]> {
		const emptyArray = ArrayUtil.buildEmptyArray(count)

		const result = await Promise.all(
			emptyArray.map(async (_, index) => await callback(index))
		)

		return result
	}
}

export default new MapUtil()
