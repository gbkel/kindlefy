import SyncModule from "@/Modules/SyncModule"
import ImportationModule from "@/Modules/ImportationModule"
import SetupInputModule from "@/Modules/SetupInputModule"
import ConversionModule from "@/Modules/ConversionModule"

class App {
	private readonly setupInputModule = new SetupInputModule()
	private readonly importationModule = new ImportationModule()
	private readonly conversionModule = new ConversionModule()

	async run (): Promise<void> {
		const config = await this.setupInputModule.fetch()

		const syncModule = new SyncModule(config.sender, config.kindle)

		for (const source of config.sources) {
			const importedSource = await this.importationModule.import(source)

			const documents = await this.conversionModule.convert(importedSource)

			for (const document of documents) {
				await syncModule.sync(document)
			}
		}
	}
}

export default App
