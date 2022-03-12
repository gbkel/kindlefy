import { Readable } from "stream"

export type AppendInput = {
	data: Readable
	fileName: string
}
