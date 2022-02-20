import path from "path"

import {
	StorageContract,
	DocumentModelCreationAttributes,
	DocumentModelSavedAttributes
} from "@/Protocols/StorageProtocol"

import EnvironmentValidation from "@/Validations/EnvironmentValidation"

import JSONDatabaseService from "@/Services/JSONDatabaseService"

import GithubActionsUtil from "@/Utils/GithubActionsUtil"

import { StorageConfig } from "@/Protocols/SetupInputProtocol"

class LocalStorageTool implements StorageContract {
	private readonly JSONDatabaseService: JSONDatabaseService<DocumentModelSavedAttributes>
	private readonly databaseName = "kindlefy-local-database.json"
	private readonly databasePath = GithubActionsUtil.githubActionMainRepositoryPath
	private readonly storageConfig: StorageConfig

	constructor (storageConfig: StorageConfig) {
		this.JSONDatabaseService = new JSONDatabaseService(this.databaseFullPath)
		this.storageConfig = storageConfig
	}

	async retrieveOneDocumentByTitle (documentTitle: string): Promise<DocumentModelSavedAttributes | null> {
		try {
			const document = await this.JSONDatabaseService.get(documentTitle)

			return document
		} catch {
			return null
		}
	}

	async saveDocuments (documents: DocumentModelCreationAttributes[]): Promise<void> {
		await Promise.all(
			documents.map(async document => {
				await this.JSONDatabaseService.set(document.title, {
					...document,
					createdAt: new Date()
				})
			})
		)

		if (EnvironmentValidation.isGithubActionEnvironment) {
			const content = await this.JSONDatabaseService.dumpFileDatabaseToBuffer()

			await GithubActionsUtil.updateRepositoryFile({
				auth: {
					accessToken: this.storageConfig.githubAccessToken
				},
				author: {
					name: "Kindlefy",
					email: "kindlefy@guilherr.me"
				},
				data: content,
				where: {
					path: this.databaseName
				}
			})
		}
	}

	private get databaseFullPath (): string {
		return path.resolve(this.databasePath, this.databaseName)
	}
}

export default LocalStorageTool
