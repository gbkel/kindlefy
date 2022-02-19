import * as github from "@actions/github"

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
				message: "feat(kindlefy): update database",
				content: contentEncoded,
				committer: author,
				author,
				sha: oldFileSha
			})
		} catch (error) {
			ErrorHandlerService.handle(error)
		}
	}
}

export default new GithubActionsUtil()
