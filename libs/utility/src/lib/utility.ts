export function* range(start: number, end: number) {
	for (let current = start; current < end; current++)
		yield current
}
