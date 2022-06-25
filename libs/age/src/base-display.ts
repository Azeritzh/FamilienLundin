export interface BaseDisplay<Action> {
	show(fractionOfTick: number): void
	onDestroy?: () => void
	getNewActions(): Action[]
}
