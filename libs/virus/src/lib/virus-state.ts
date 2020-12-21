import { GameGrid, GameState } from "@lundin/age"
import { VirusConfig } from "./virus-config"

export class VirusState implements GameState {
	constructor(
		public config: VirusConfig,
		public currentPlayer = 1,
		public board = new GameGrid<number>(config.width, config.height),
		public tick = 0,
	) {
		this.board.setAll(this.config.initialPositions)
	}

	findMovablePlayers() {
		return []
	}

	findWinner() {
		return null
	}
}
