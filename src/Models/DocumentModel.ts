import { Readable } from "stream"

import { SourceConfig } from "@/Protocols/SetupInputProtocol"

export interface DocumentModel {
	title: string
	filename: string
	data: Buffer | Readable
	type: SourceConfig["type"]
}
