import { GameLogic } from "@lundin/age"
import { VirusAction } from "../virus-action"
import { VirusConfig } from "../virus-config"
import { VirusState } from "../virus-state"

export class TurnLogic implements GameLogic<VirusAction> {
	constructor(
		private readonly config: VirusConfig,
		private readonly state: VirusState,
	) { }

	update(actions: VirusAction[]): void {
		this.turnNeighbours(actions[0])
	}

	turnNeighbours(action: VirusAction) {
		for (let n = Math.max(0, action.destination.x - 1); n < Math.min(this.config.width - 1, action.destination.x + 1); n++)
			for (let m = Math.max(0, action.destination.y - 1); m < Math.min(this.config.height - 1, action.destination.y + 1); n++)
				if (this.state.board.get(n, m) != 0)
					this.state.board.set(n, m, action.player)
	}
}
