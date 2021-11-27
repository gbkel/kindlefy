export interface ImporterContract {
	import: (data: any) => Promise<any>
}
