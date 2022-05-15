import { GenerateInput } from "@/Protocols/EbookCoverProtocol"

import TempFolderService from "@/Services/TempFolderService"
import BrowserService from "@/Services/BrowserService"

import SanitizationUtil from "@/Utils/SanitizationUtil"

class EbookCoverService {
	private readonly defaultSize = { width: 650, height: 1000 }

	async generate (input: GenerateInput): Promise<string> {
		const {
			title,
			subTitle
		} = input

		const coverHTML = this.buildCoverHTML(input)

		const coverFileName = SanitizationUtil.sanitizeFilename(`${title}-${subTitle}-cover.png`)
		const coverFilePath = await TempFolderService.mountTempPath(coverFileName)

		await this.renderHTML(coverHTML, coverFilePath)

		return coverFilePath
	}

	private async renderHTML (html: string, renderedHtmlPath: string): Promise<string> {
		const page = await BrowserService.getPage()

		await page.setViewport({ width: this.defaultSize.width, height: this.defaultSize.height })

		await page.setContent(html)

		await page.screenshot({ type: "png", path: renderedHtmlPath })

		await page.close()

		return renderedHtmlPath
	}

	private buildCoverHTML (input: GenerateInput): string {
		const {
			title,
			subTitle,
			rawCoverUrl
		} = input

		return `
			<!DOCTYPE html>
				<html lang="en">
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						
						<title>Thumbnail</title>
					
						<link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@700&display=swap" rel="stylesheet">
					
						<style>
							body {
								margin: 0;
								font-family: Ubuntu, sans-serif;
								color: #FFFFFF;
								background: #000000;
								background-image: 
									radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.7) 2%, transparent 0%), 
									radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.7) 2%, transparent 0%);
								background-size: 100px 100px;
								height: 100vh;
							}
					
							.cover-container {
								width: 100%;
								height: 100%;
								display: flex;
								flex-direction: column;
								align-items: center;
								justify-content: center;
								text-align: center;
							}
					
							.cover-description-title {
								font-size: 80px;
								line-height: 80px;
								font-weight: bolder;
								margin: 0;
							}
			
							.cover-description-subtitle {
								font-size: 50px;
								margin: 32px 0 0 0;
								font-weight: normal;
							}

							.cover-description-container {
								position: absolute;
								top: 0;
								left: 0;

								width: 100%;
								height: 100%;

								display: flex;
								align-items: center;
								justify-content: center;
							}

							.cover-description-content {
								max-width: ${this.defaultSize.width}px;
								max-height: ${this.defaultSize.height}px;
								width: 100%;
								height: 100%;

								display: flex;
								align-items: center;
								justify-content: center;
								flex-direction: column;

								padding: 64px;

								z-index: 1;
							}

							.cover-image {
								max-width: ${this.defaultSize.width}px;
								max-height: ${this.defaultSize.height}px;
								width: 100%;
								height: 100%;

								object-fit: cover;
								object-position: center;
								filter: blur(4px);

								opacity: 0.3;
							}
						</style>
					</head>

					<body>
						<div class="cover-container">
							<div class="cover-description-container">
								<div class="cover-description-content">
									<h1 class="cover-description-title">${title}</h1>

									${subTitle ? `<h2 class="cover-description-subtitle">${subTitle}</h2>` : ""}
								</div>
							</div>

							${rawCoverUrl ? `<image class="cover-image" src="${rawCoverUrl}" />` : ""}
						</div>
					</body>
			</html>
		`
	}
}

export default EbookCoverService
