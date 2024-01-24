import { Content, ImporterContract } from "@/Protocols/ImporterProtocol"
import { SourceConfig } from "@/Protocols/SetupInputProtocol"


class RecipeImporterTool implements ImporterContract<Buffer> {

	async import(sourceConfig: SourceConfig): Promise<Content<Buffer>> {

		return {
			data: null,
			sourceConfig
		}
	}
}

export default new RecipeImporterTool()
