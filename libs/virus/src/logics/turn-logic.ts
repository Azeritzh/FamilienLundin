import { GameLogic } from "@lundin/age"
import { VirusAction } from "../virus-action"
import { VirusState } from "../virus-state"

export class TurnLogic implements GameLogic<VirusAction> {
	constructor(
		private readonly state: VirusState,
	) { }

	Update(actions: VirusAction[]): void {
		this.turnNeighbours(actions[0])
	}

	turnNeighbours(action: VirusAction) {
		for (const { i, j, field } of this.state.board.fieldsAround(action.destination.x, action.destination.y))
			if (field != 0)
				this.state.board.set(i, j, action.player)
	}
}
