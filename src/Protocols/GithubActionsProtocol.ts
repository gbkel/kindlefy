export type UpdateFileInput = {
	author: {
		name: string
		email: string
	}
	where: {
		path: string
	}
	auth: {
		accessToken: string
	}
	data: Buffer
}
