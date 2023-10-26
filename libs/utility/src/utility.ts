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
	Floor: Math.floor,
	Tau: Math.PI * 2,
}