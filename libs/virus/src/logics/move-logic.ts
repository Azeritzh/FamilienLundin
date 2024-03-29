import { GameLogic } from "@lundin/age"
import { VirusAction } from "../virus-action"
import { VirusState } from "../virus-state"

export class MoveLogic implements GameLogic<VirusAction> {
	constructor(
		private readonly state: VirusState,
	) { }

	Update(actions: VirusAction[]): void {
		this.movePiece(actions[0])
	}

	movePiece(action: VirusAction) {
		if (Math.abs(action.origin.x - action.destination.x) > 1
			|| Math.abs(action.origin.y - action.destination.y) > 1)
			this.state.board.set(action.origin.x, action.origin.y, 0)
		this.state.board.set(action.destination.x, action.destination.y, action.player)
	}
}
