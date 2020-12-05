import { createHash } from "crypto"
import * as bcrypt from "bcrypt"

export function hashRefreshToken(token: string) {
	if (!token)
		return null
	const hash = createHash("sha1")
		.update(token)
		.digest("base64")
	return bcrypt.hash(hash, 10)
}

export async function refreshTokenMatches(token: string, hashedToken: string) {
	if (!token || !hashedToken)
		return false
	const hash = createHash("sha1")
		.update(token)
		.digest("base64")
	return await bcrypt.compare(hash, hashedToken)
}

export function hashPassword(password: string) {
	return bcrypt.hash(password, 10)
}

export async function passwordMatches(password: string, hashedPassword: string) {
	if (!password || !hashedPassword)
		return false
	return await bcrypt.compare(password, hashedPassword)
}

export function expirationFrom(token: string) {
	const payload = token.split(".")[1]
	const decodedPayload = Buffer.from(payload, "base64").toString()
	const parsedPayload = JSON.parse(decodedPayload)
	return parsedPayload.exp
}
