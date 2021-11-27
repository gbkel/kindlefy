import { SourceConfig } from "@/Protocols/SetupInputProtocol"

export type Content = {
	data: any
	sourceConfig: SourceConfig
}

export interface ImporterContract {
	import: (sourceConfig: SourceConfig) => Promise<Content>
}
