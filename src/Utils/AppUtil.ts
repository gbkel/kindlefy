import path from "path"

import { PackageJSON } from "@/Protocols/AppProtocol"

class AppUtil {
	get appName (): string {
		return this.packageJSON.name
	}

	get appVersion (): string {
		return this.packageJSON.version
	}

	private get packageJSON (): PackageJSON {
		const packageJSONPath = path.resolve(__dirname, "..", "..", "package.json")

		return require(packageJSONPath)
	}
}

export default new AppUtil()
