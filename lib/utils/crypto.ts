import { timingSafeEqual } from 'crypto'

export function constantTimeEqual(a: string, b: string) {
	const bufferA = Buffer.from(a)
	const bufferB = Buffer.from(b)
	if (bufferA.length !== bufferB.length) return false
	return timingSafeEqual(bufferA, bufferB)
}
