import { SourceConfig } from "@/Protocols/SetupInputProtocol"

export type Content<Data extends unknown> = {
	data: Data
	sourceConfig: SourceConfig
}

export interface ImporterContract<Data extends unknown> {
	import: (sourceConfig: SourceConfig) => Promise<Content<Data>>
}
