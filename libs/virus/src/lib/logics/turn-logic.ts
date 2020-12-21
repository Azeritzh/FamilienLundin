import { GameLogic } from "@lundin/age"
import { range } from "@lundin/utility"
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
		const startX = Math.max(0, action.destination.x - 1)
		const endX = Math.min(this.config.width, action.destination.x + 2)
		const startY = Math.max(0, action.destination.y - 1)
		const endY = Math.min(this.config.height, action.destination.y + 2)
		for (const n of range(startX, endX))
			for (const m of range(startY, endY))
				if (this.state.board.get(n, m) != 0)
					this.state.board.set(n, m, action.player)
	}
}
