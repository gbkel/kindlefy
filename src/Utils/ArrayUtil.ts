class ArrayUtil {
	buildEmptyArray (size: number): any[] {
		const emptyArray = [...(new Array(size))]

		return emptyArray
	}
}

export default new ArrayUtil()
