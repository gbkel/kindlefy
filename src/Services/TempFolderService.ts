import fs from "fs"
import path from "path"

class TempFolderService {
	private get path (): string {
		return path.resolve(__dirname, "..", "..", "tmp")
	}

	async mountTempPath (filename: string): Promise<string> {
		await this.generate()

		return path.resolve(this.path, filename)
	}

	async generate (): Promise<void> {
		const tmpFolderExists = fs.existsSync(this.path)

		if (!tmpFolderExists) {
			await fs.promises.mkdir(this.path)
		}
	}

	async clean (): Promise<void> {
		await fs.promises.rmdir(this.path, {
			recursive: true
		})
	}
}

export default new TempFolderService()
