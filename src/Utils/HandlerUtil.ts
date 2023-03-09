class HandlerUtil {
	handleWithFallback<HandlerFn extends Function> (...args: unknown[]) {
		return async (handlers: HandlerFn[]): Promise<void> => {
			let result: any

			for (const handlerIndex in handlers) {
				try {
					const handler = handlers[handlerIndex]
	
					result = await handler.call(args)
	
					break
				} catch (error) {
					const nextMangaImporterFallbackIndex = Number(handlerIndex) + 1
					const isThereAnotherImporterToFallback = Boolean(handlers[nextMangaImporterFallbackIndex])
	
					if (!isThereAnotherImporterToFallback) {
						return await Promise.reject(error)
					}
				}
			}
		}
	}
}

export default new HandlerUtil()
