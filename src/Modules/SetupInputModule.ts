import { Config } from "@/Protocols/SetupInputProtocol"

class SetupInputModule {
	async fetch (): Promise<Config> {
		return {
			kindle: {
				email: ""
			},
			sender: [{ type: "gmail", email: "", password: "" }],
			sources: [{ url: "", type: "rss" }]
		}
	}
}

export default SetupInputModule
