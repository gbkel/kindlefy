import { SourceConfig } from "@/Protocols/SetupInputProtocol"

export type ContentType = "medium"

export type ContentTypeValidator = (SourceConfig: SourceConfig) => boolean

export type ContentEnricher = (content: string) => Promise<string>
