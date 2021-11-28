import { Config } from "@/Protocols/SetupInputProtocol"

class SetupInputModule {
	async fetch (): Promise<Config> {
		return {
			kindle: { email: "" },
			sender: [],
			sources: []
		}
	}
}

export default SetupInputModule
