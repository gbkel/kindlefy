import * as github from "@actions/github"
import path from "path"

import {
	StorageContract,
	DocumentModelCreationAttributes,
	DocumentModelSavedAttributes
} from "@/Protocols/StorageProtocol"

import EnvironmentValidation from "@/Validations/EnvironmentValidation"

import JSONDatabaseService from "@/Services/JSONDatabaseService"

import { StorageConfig } from "@/Protocols/SetupInputProtocol"

class LocalStorageTool implements StorageContract {
	private readonly JSONDatabaseService: JSONDatabaseService<DocumentModelSavedAttributes>
	private readonly databaseName = "kindlefy-local-database.json"
	private readonly databasePath = path.resolve(__dirname, "..", "..", "..", "..")
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

		const isThereAnyDocumentToUpdate = Boolean(documents.length)

		if (EnvironmentValidation.isGithubActionEnvironment && isThereAnyDocumentToUpdate) {
			const octokit = github.getOctokit(this.storageConfig.githubAccessToken)

			const content = await this.JSONDatabaseService.dump()
			const contentEncoded = content.toString("base64")

			const kindlefyAuth = {
				name: "Kindlefy",
				email: "kindlefy@guilherr.me"
			}

			await octokit.rest.repos.createOrUpdateFileContents({
				...github.context.repo,
				path: this.databaseName,
				message: "feat(kindlefy): update database",
				content: contentEncoded,
				committer: kindlefyAuth,
				author: kindlefyAuth
			})
		}
	}

	private get databaseFullPath (): string {
		return path.resolve(this.databasePath, this.databaseName)
	}
}

export default LocalStorageTool
