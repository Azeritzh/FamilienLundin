export function* range(start: number, end: number) {
	for (let current = start; current < end; current++)
		yield current
}

export function clip(value: number, min: number, max: number, wrap = false) {
	if (max <= min)
		throw "Error"
	if (!wrap) {
		if (value < min)
			value = min
		else if (max <= value)
			value = max
		return value
	}
	while (value < min)
		value += max - min
	while (max <= value)
		value -= max - min
	return value
}

export function hexesAdjacentTo(x: number, y: number) {
	return [hexNorthWestOf(x, y), hexNorthEastOf(x, y), hexWestOf(x, y), hexEastOf(x, y), hexSouthWestOf(x, y), hexSouthEastOf(x, y)]
}

export function hexNorthWestOf(x: number, y: number, distance = 1) {
	const offset = ((y + distance) % 2 == 0) ? -1 : 0
	return { x: x - Math.floor(distance / 2) + offset, y: y - distance }
}
export function hexNorthEastOf(x: number, y: number, distance = 1) {
	const offset = ((y + distance) % 2 == 0) ? 0 : 1
	return { x: x + Math.floor(distance / 2) + offset, y: y - distance }
}
export function hexWestOf(x: number, y: number, distance = 1) {
	return { x: x - distance, y: y }
}
export function hexEastOf(x: number, y: number, distance = 1) {
	return { x: x + distance, y: y }
}
export function hexSouthWestOf(x: number, y: number, distance = 1) {
	const offset = ((y + distance) % 2 == 0) ? -1 : 0
	return { x: x - Math.floor(distance / 2) + offset, y: y + distance }
}
export function hexSouthEastOf(x: number, y: number, distance = 1) {
	const offset = ((y + distance) % 2 == 0) ? 0 : 1
	return { x: x + Math.floor(distance / 2) + offset, y: y + distance }
}

export function randomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min) + min)
}

export function randomIntBelow(max: number) {
	return Math.floor(Math.random() * max)
}

export function randomNumber(min: number, max: number) {
	return Math.random() * (max - min) + min
}

export function randomNumberBelow(max: number) {
	return Math.random() * max
}

export function randomise<T>(list: T[]) {
	const shuffled = list.slice()
	const indexes = list.map((_, i) => i)
	for (let i = 0; i < list.length; i++) {
		const index = indexes[randomIntBelow(indexes.length)]
		shuffled[i] = list[index]
		indexes.splice(i, 1)
	}
	return shuffled
}

export const Tau = Math.PI * 2

export function Rotate(source: number, angle: number) {
	source += angle
	while (source < 0)
		source += Tau
	while (source >= Tau)
		source -= Tau
	return source
}

export const MathF = {
	Ceiling: Math.ceil,
	Floor: Math.floor,
	Round: Math.round,
	Tau: Math.PI * 2,
	Abs: Math.abs,
	Max: Math.max,
	Min: Math.min,
	Pow: Math.pow,
}

export function Contain(value: number, min: number, max: number) {
	const size = max - min
	if (value < min)
		value += size * MathF.Ceiling((min - value) / size)
	else if (value >= max)
		value -= size * MathF.Ceiling((value - max) / size)
	return value
}

export function ToClass(source: any, cclass: any) {
	return Object.assign(new cclass(), source)
}

export async function encrypt(messageText: string, passwordText: string) {
	return await encryptData(messageText, passwordText)
}

export async function decrypt(encryptedText: string, passwordText: string) {
	return await decryptData(encryptedText, passwordText)
}


const buff_to_base64 = (buff: Uint8Array) => btoa(
	new Uint8Array(buff).reduce(
		(data, byte) => data + String.fromCharCode(byte), ''
	)
)

const base64_to_buf = (b64: string) =>
	Uint8Array.from(atob(b64), (c) => c.charCodeAt(null!))
//Uint8Array.from(window.Buffer.from(b64, "base64"))


const getPasswordKey = (password: string) =>
	window.crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, [
		"deriveKey",
	])

const deriveKey = (passwordKey: CryptoKey, salt: Uint8Array, keyUsage: KeyUsage[]) =>
	window.crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt: salt,
			iterations: 250000,
			hash: "SHA-256",
		},
		passwordKey,
		{ name: "AES-GCM", length: 256 },
		false,
		keyUsage
	)

async function encryptData(secretData: string, password: string) {
	try {
		const salt = window.crypto.getRandomValues(new Uint8Array(16))
		const iv = window.crypto.getRandomValues(new Uint8Array(12))
		const passwordKey = await getPasswordKey(password)
		const aesKey = await deriveKey(passwordKey, salt, ["encrypt"])
		const encryptedContent = await window.crypto.subtle.encrypt(
			{
				name: "AES-GCM",
				iv: iv,
			},
			aesKey,
			new TextEncoder().encode(secretData)
		)

		const encryptedContentArr = new Uint8Array(encryptedContent)
		const buff = new Uint8Array(
			salt.byteLength + iv.byteLength + encryptedContentArr.byteLength
		)
		buff.set(salt, 0)
		buff.set(iv, salt.byteLength);
		buff.set(encryptedContentArr, salt.byteLength + iv.byteLength)
		const base64Buff = buff_to_base64(buff)
		return base64Buff
	} catch (e) {
		console.log(`Error - ${e}`)
		return ""
	}
}

async function decryptData(encryptedData: string, password: string) {
	try {
		const encryptedDataBuff = base64_to_buf(encryptedData)
		const salt = encryptedDataBuff.slice(0, 16)
		const iv = encryptedDataBuff.slice(16, 16 + 12)
		const data = encryptedDataBuff.slice(16 + 12)
		const passwordKey = await getPasswordKey(password)
		const aesKey = await deriveKey(passwordKey, salt, ["decrypt"])
		const decryptedContent = await window.crypto.subtle.decrypt(
			{
				name: "AES-GCM",
				iv: iv,
			},
			aesKey,
			data
		)
		return new TextDecoder().decode(decryptedContent)
	} catch (e) {
		console.log(`Error - ${e}`)
		return ""
	}
}