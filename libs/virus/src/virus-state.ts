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
		const movablePlayers = [...range(0, this.config.playerCount + 1)].map(() => false)
		for (const { x, y, field } of this.board.allFields()) {
			if (field === 0)
				continue

			for (const { i, j } of this.board.fieldsAround(x, y, 2)) {
				if (this.board.get(i, j) === 0)
					movablePlayers[field] = true
				if (this.allPlayersCanMove(movablePlayers))
					return movablePlayers
			}
		}
		return movablePlayers
	}

	private allPlayersCanMove(movablePlayers: boolean[]) {
		return movablePlayers.filter(x => x).length === this.config.playerCount
	}

	findWinner() {
		if (this.currentPlayer !== 0)
			return
		const counts = [...range(0, this.config.playerCount + 1)].map(() => 0)
		for (const { field } of this.board.allFields())
			counts[field]++
		counts[0] = 0
		const most = Math.max(...counts)
		return counts.indexOf(most)
	}
}

