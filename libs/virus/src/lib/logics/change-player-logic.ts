import { GameLogic } from "@lundin/age"
import { VirusAction } from "../virus-action"
import { VirusConfig } from "../virus-config"
import { VirusState } from "../virus-state"

export class ChangePlayerLogic implements GameLogic<VirusAction> {
	constructor(
		private readonly config: VirusConfig,
		private readonly state: VirusState,
	) { }

	update() {
		this.changePlayer()
	}

	changePlayer() {
		const movablePlayers = this.state.findMovablePlayers()
		let nextPlayer = this.state.currentPlayer + 1
		if (movablePlayers.filter(x => x).length < 2) {
			nextPlayer = 0
		} else {
			if (nextPlayer > this.config.playerCount)
				nextPlayer = 1
			while (!movablePlayers[nextPlayer]) {
				nextPlayer++
				if (nextPlayer > this.config.playerCount)
					nextPlayer = 1
			}
		}
		this.state.currentPlayer = nextPlayer
	}
}
