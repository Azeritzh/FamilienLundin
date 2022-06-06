export interface GameState {
	tick: number
	finishUpdate?(): void
}
