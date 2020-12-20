export class AgEngine<GameAction> {
	constructor(
		private readonly logics: GameLogic<GameAction>[],
		private readonly state: GameState
	) { }

	update(...actions: GameAction[]) {
		this.state.tick++
		for (const logic of this.logics)
			logic.update(actions)
		this.state.finishUpdate?.()
	}
}

export interface GameState {
	tick: number
	finishUpdate?(): void
}

export interface GameLogic<GameAction> {
	update(actions: GameAction[]): void
}
