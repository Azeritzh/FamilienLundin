export interface GameValidator<GameAction> {
	validate(actions: GameAction[]): string[]
}
