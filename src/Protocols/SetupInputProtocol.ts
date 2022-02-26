import { Ordering } from "@/Protocols/DataManipulationProtocol"

export type SenderConfig = {
	email: string
	password?: string
	host?: string
	user?: string
	port?: number
	type: "smtp" | "gmail" | "outlook"
}

export type SyncConfig = {
	noDuplicatedSync: boolean
}

export type StorageConfig = {
	type: "local"
	githubAccessToken?: string
}

export type SourceConfig = {
	url?: string
	name?: string
	count?: number
	order?: Ordering
	/**
	 * Every RSS post will be a new document inside your kindle.
	 */
	splitRSSPosts?: boolean
	type: "rss" | "manga"
}

export type KindleConfig = {
	email: string
}

export interface Config {
	kindle: KindleConfig
	senders: SenderConfig[]
	sources: SourceConfig[]
	storages: StorageConfig[]
	sync: SyncConfig
}
