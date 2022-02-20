import * as github from "@actions/github"
import path from "path"

import { UpdateFileInput } from "@/Protocols/GithubActionsProtocol"

import ErrorHandlerService from "@/Services/ErrorHandlerService"

class GithubActionsUtil {
	async updateRepositoryFile (input: UpdateFileInput): Promise<void> {
		try {
			const {
				auth,
				author,
				where,
				data
			} = input

			const enrichedWhere = {
				...github.context.repo,
				path: where.path
			}

			const octokit = github.getOctokit(auth.accessToken)

			const oldContent = await octokit.rest.repos.getContent(enrichedWhere).catch(ErrorHandlerService.handle)
			const oldFileSha = (oldContent as any)?.data?.sha

			const contentEncoded = data.toString("base64")

			await octokit.rest.repos.createOrUpdateFileContents({
				...enrichedWhere,
				message: "feat(kindlefy): update file",
				content: contentEncoded,
				committer: author,
				author,
				sha: oldFileSha
			})
		} catch (error) {
			ErrorHandlerService.handle(error)
		}
	}

	/**
	 * This is the path outside the kindlefy folder that is created inside the Github Action repository
	 * what means that this path references the Github Action repository root folder.
	 */
	get githubActionMainRepositoryPath (): string {
		return path.resolve(__dirname, "..", "..", "..")
	}
}

export default new GithubActionsUtil()
