import { GameValidator } from "@lundin/age"
import { NoughtsAndCrossesAction } from "./noughts-and-crosses-logic"
import { NoughtsAndCrossesState } from "./noughts-and-crosses-state"

export class NoughtsAndCrossesValidator implements GameValidator<NoughtsAndCrossesAction> {
	constructor(private readonly state: NoughtsAndCrossesState) { }

	validate(actions: NoughtsAndCrossesAction[]) {
		const action = actions[0]
		if (action.piece !== this.state.currentPlayer)
			return { isValid: false, problems: [`Not ${action.piece}'s turn`] }
		if (this.state.pieceAt(action.x, action.y) !== null)
			return { isValid: false, problems: ["Position is not empty"] }
		return { isValid: true, problems: [] }
	}
}
