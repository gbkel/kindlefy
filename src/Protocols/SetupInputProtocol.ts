export type SenderConfig = {
	email: string
	password?: string
	host?: string
	user?: string
	port?: number
	type: "smtp" | "gmail" | "outlook"
}

export type SourceConfig = {
	url?: string
	name?: string
	type: "rss" | "manga"
}

export type KindleConfig = {
	email: string
}

export interface Config {
	kindle: KindleConfig
	sender: SenderConfig[]
	sources: SourceConfig[]
}
