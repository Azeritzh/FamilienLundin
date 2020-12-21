import { GameGrid, GameState } from "@lundin/age"

export class VirusState implements GameState {
	constructor(
		public playerCount: number = 2,
		public board: GameGrid<number> = new GameGrid<number>(8, 8),
		public tick: number = 0,
	) { }

	findWinner() {
		return null
	}
}
