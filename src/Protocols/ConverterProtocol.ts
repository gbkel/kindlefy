import { DocumentModel } from "@/Models/DocumentModel"

import { Content } from "@/Protocols/ImporterProtocol"

export interface ConverterContract<Data extends unknown> {
	convert: (content: Content<Data>) => Promise<DocumentModel[]>
}
