export interface GameLogic<GameAction> {
	update(actions: GameAction[]): void
}
