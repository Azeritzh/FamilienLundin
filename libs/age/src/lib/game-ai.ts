export interface GameAi<Game, GameAction> {
	requestActions(game: Game): GameAction[]
}
