import { DocumentMetadata } from "@/Protocols/DocumentProtocol"

import FileUtil from "@/Utils/FileUtil"

export class DocumentModel {
	private readonly metadata: DocumentMetadata

	constructor (metadata: DocumentMetadata) {
		this.metadata = metadata
	}

	get contentType (): string {
		return FileUtil.getMimetypeByFileName(this.metadata.filename)
	}

	get title (): string {
		return this.metadata.title
	}

	get data (): DocumentMetadata["data"] {
		return this.metadata.data
	}

	get filename (): string {
		return this.metadata.filename
	}
}
