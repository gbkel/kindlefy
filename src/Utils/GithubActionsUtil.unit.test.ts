import fs from "fs"

import GithubActionsUtil from "@/Utils/GithubActionsUtil"
import AppUtil from "@/Utils/AppUtil"

describe("GithubActionsUtil", () => {
	describe("githubActionMainRepositoryPath()", () => {
		test("Should point exactly outside kindlefy repository", async () => {
			const folders = await fs.promises.readdir(GithubActionsUtil.githubActionMainRepositoryPath)

			const kindlefyFolder = folders.find(folder => folder === AppUtil.appName)

			expect(kindlefyFolder).toBe(AppUtil.appName)
		})
	})
})
