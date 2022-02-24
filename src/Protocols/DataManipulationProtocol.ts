export type Ordering = "asc" | "desc"

export type OrderByInput<Data> = {
	property: keyof Data
	type: Ordering
}

export type ManipulateArrayOptions<Data> = {
	/**
	 * Amount of items to keep in array.
	 */
	limit?: number
	order?: OrderByInput<Data>
}
