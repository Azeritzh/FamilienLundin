import { GameGrid, GameState } from "@lundin/age"
import { range } from "@lundin/utility"
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
		const movablePlayers = []
		this.board.forAll((i, j, piece) => {
			if (piece === 0)
				return

			for (const n of range(Math.max(0, i - 2), Math.min(this.config.width, i + 3))) {
				for (const m of range( Math.max(0, j - 2), Math.min(this.config.height, j + 3))) {
					const playerForField = this.board.get(n, m)
					if (playerForField > 0)
						movablePlayers[playerForField] = true
					if (this.allPlayersCanMove(movablePlayers))
						return true // this breaks out of forAll()
				}
			}
		})
		return movablePlayers
	}

	private allPlayersCanMove(movablePlayers: boolean[]) {
		return movablePlayers.filter(x => x).length === this.config.playerCount
	}

	findWinner() {
		return null
	}
}

