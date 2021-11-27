export type SenderConfig = {
	email: string
	password: string
	type: "smtp"
}

export type SourceConfig = {
	url: string
	type: "rss"
}

export interface Config {
	sender: SenderConfig[]
	sources: SourceConfig[]
}
