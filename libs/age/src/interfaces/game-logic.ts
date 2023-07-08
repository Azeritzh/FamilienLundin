export interface GameLogic<GameAction> {
	Update(actions: GameAction[]): void
}
