class ErrorHandlerService {
	handle (error: Error): void {
		console.log(error)
	}
}

export default new ErrorHandlerService()
