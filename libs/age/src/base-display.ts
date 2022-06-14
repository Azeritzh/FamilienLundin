export interface BaseDisplay {
	setSize(width: number, height: number): void
	show(fractionOfTick: number): void
}
