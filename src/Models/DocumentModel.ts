import { SourceConfig } from "@/Protocols/SetupInputProtocol"

export interface DocumentModel {
	title: string
	filename: string
	data: Buffer
	type: SourceConfig["type"]
}
