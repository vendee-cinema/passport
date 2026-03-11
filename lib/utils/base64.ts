export function base64UrlEncode(buffer: Buffer | string) {
	const s = typeof buffer === 'string' ? Buffer.from(buffer) : buffer
	return s
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/\=+$/, '')
}

export function base64UrlDecode(str: string) {
	str = str.replace(/-/g, '+').replace(/_/g, '/')
	while (str.length % 4) str += '='
	return Buffer.from(str, 'base64').toString()
}
