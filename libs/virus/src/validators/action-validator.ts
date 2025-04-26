import { GameValidator } from "@lundin/age"
import { VirusAction } from "../virus-action"
import { VirusState } from "../virus-state"

export class ActionValidator implements GameValidator<VirusAction> {
	constructor(
		private readonly state: VirusState,
	) { }

	validate(actions: VirusAction[]): string[] | null {
		const action = actions[0]
		if (!this.originIsWithinBoard(action))
			return ["origin must be within board"]
		if (!this.originIsCurrentPlayer(action))
			return ["must move own piece"]
		if (!this.destinationIsWithinBoard(action))
			return ["destination must be within board"]
		if (!this.destinationIsEmpty(action))
			return ["destination must be empty"]
		if (this.isMovingTooFar(action))
			return ["must not move too far"]
		return null
	}

	originIsWithinBoard(action: VirusAction) {
		return this.state.board.isWithinBounds(action.origin.x, action.origin.y)
	}

	originIsCurrentPlayer(action: VirusAction) {
		return this.state.board.get(action.origin.x, action.origin.y) === this.state.currentPlayer
	}

	destinationIsWithinBoard(action: VirusAction) {
		return this.state.board.isWithinBounds(action.destination.x, action.destination.y)
	}

	destinationIsEmpty(action: VirusAction) {
		return this.state.board.get(action.destination.x, action.destination.y) === 0
	}

	isMovingTooFar(action: VirusAction) {
		return 2 < Math.abs(action.origin.x - action.destination.x) || 2 < Math.abs(action.origin.y - action.destination.y)
	}
}
