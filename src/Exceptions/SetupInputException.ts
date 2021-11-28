export class NoValidSetupInputFoundException extends Error {
	constructor () {
		super("No setup input config was found, make sure you have set it by environment variables or github actions variables.")
	}
}
