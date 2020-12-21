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
		const firstX = Math.max(0, action.destination.x - 1)
		const lastX = Math.min(this.config.width - 1, action.destination.x + 1)
		const firstY = Math.max(0, action.destination.y - 1)
		const lastY = Math.min(this.config.height - 1, action.destination.y + 1)
		for (let n = firstX; n < lastX; n++)
			for (let m = firstY; m < lastY; m++)
				if (this.state.board.get(n, m) != 0)
					this.state.board.set(n, m, action.player)
	}
}
