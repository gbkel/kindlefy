export type SMTPConfig = {
	email: string
	host?: string
	user?: string
	password?: string
	port?: number
}

export type CustomTransportOptions = {
	service?: "Hotmail"
	secure?: boolean
	tls?: {
		ciphers?: "SSLv3"
		rejectUnauthorized?: boolean
	}
}
