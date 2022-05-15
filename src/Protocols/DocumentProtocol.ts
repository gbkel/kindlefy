import { Readable } from "stream"

import { SourceConfig } from "@/Protocols/SetupInputProtocol"

export type DocumentMetadata = {
	title: string
	filename: string
	data: Buffer | Readable
	type: SourceConfig["type"]
}
