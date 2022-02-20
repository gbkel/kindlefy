import { PackageJSON } from "@/Protocols/AppProtocol"

class AppUtil {
	get appName (): string {
		return this.packageJSON.name
	}

	get appVersion (): string {
		return this.packageJSON.version
	}

	private get packageJSON (): PackageJSON {
		return require("../../package.json")
	}
}

export default new AppUtil()
