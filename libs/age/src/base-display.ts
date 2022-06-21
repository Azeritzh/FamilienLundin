export interface BaseDisplay {
	show(fractionOfTick: number): void
	onDestroy?: () => void
}
