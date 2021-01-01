export function* range(start: number, end: number) {
	for (let current = start; current < end; current++)
		yield current
}

export interface Vector2 {
	x: number
	y: number
}

export interface Vector3 {
	x: number
	y: number
	z: number
}
