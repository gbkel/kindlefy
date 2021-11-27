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

		const importedSources = await Promise.all(
			config.sources.map(async source => await this.importationModule.import(source))
		)

		const documents = await Promise.all(
			importedSources.map(async importedSource => await this.conversionModule.convert(importedSource))
		)

		const syncModule = new SyncModule(config.sender)

		await syncModule.sync(documents)
	}
}

export default App
