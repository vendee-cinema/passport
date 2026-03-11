import { createHmac } from 'node:crypto'

import { base64UrlDecode, base64UrlEncode, constantTimeEqual } from './utils'

const HMAC_DOMAIN = 'PassportTokenAuth/v1'
const INTERNAL_SEPARATOR = '|'

function now() {
	return Math.floor(Date.now() / 1000)
}

function serialize(user: string, iat: string, exp: string) {
	return [HMAC_DOMAIN, user, iat, exp].join(INTERNAL_SEPARATOR)
}

function computeHmac(secretKey: string, data: string) {
	return createHmac('sha256', secretKey).update(data).digest('hex')
}

function generateToken(secretKey: string, userId: string, ttl: number) {
	const issuedAt = now()
	const expiresAt = issuedAt + ttl

	const userPart = base64UrlEncode(userId)
	const iatPart = base64UrlEncode(String(issuedAt))
	const expPart = base64UrlEncode(String(expiresAt))

	const serialized = serialize(userPart, iatPart, expPart)
	const mac = computeHmac(secretKey, serialized)
	return `${userPart}.${iatPart}.${expPart}.${mac}`
}

function verifyToken(secretKey: string, token: string) {
	const parts = token.split('.')
	if (parts.length !== 4)
		return { valid: false, reason: 'Invalid token format' }

	const [userPart, iatPart, expPart, mac] = parts
	const serialized = serialize(userPart, iatPart, expPart)
	const expectedMac = computeHmac(secretKey, serialized)

	if (!constantTimeEqual(expectedMac, mac))
		return { valid: false, reason: 'Invalid token signature' }

	const expNumber = Number(base64UrlDecode(expPart))

	if (!Number.isFinite(expNumber))
		return { valid: false, reason: 'Invalid token expire date' }

	if (now() > expNumber) return { valid: false, reason: 'Token expired' }

	return { valid: true, userId: base64UrlDecode(userPart) }
}

// console.log('GENERATED TOKEN: ', generateToken('123456', 'user-123', 10))
// console.log(
// 	'USER ID: ',
// 	verifyToken(
// 		'123456',
// 		'dXNlci0xMjM.MTc3MzIzNzg3NA.MTc3MzIzNzg4NA.13a151abab1305b6cc7fd8c96c94b8408d1167f2401ee5a505050496e11d7b3d'
// 	)
// )
