import { DocumentModel } from "@/Models/DocumentModel"

import { Content } from "@/Protocols/ImporterProtocol"

export interface ConverterContract {
	convert: (content: Content) => Promise<DocumentModel>
}
