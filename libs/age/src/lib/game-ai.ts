export interface GameAi<Game, GameAction> {
	requestActions(game: Game): GameAction[]
}

export class RandomAi<Game, GameAction> implements GameAi<Game, GameAction>{
	constructor(
		private possibleActionsFor: (game: Game) => GameAction[]
	) { }

	requestActions(game: Game) {
		const possibleActions = this.possibleActionsFor(game)
		const randomIndex = Math.floor(Math.random() * possibleActions.length)
		return [possibleActions[randomIndex]]
	}
}
