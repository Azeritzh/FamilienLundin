import { GameLogic } from "@lundin/age"
import { NoughtsAndCrossesState, NoughtsAndCrossesType } from "./noughts-and-crosses-state"

export class NoughtsAndCrossesLogic implements GameLogic<NoughtsAndCrossesAction> {
	constructor(private readonly state: NoughtsAndCrossesState) { }

	update(actions: NoughtsAndCrossesAction[]): void {
		const action = actions[0]
		if (action.piece !== this.state.currentPlayer)
			throw new Error(`Not ${action.piece}'s turn`) // TODO
		if (this.state.pieceAt(action.position.x, action.position.y) !== NoughtsAndCrossesType.None)
			throw new Error("Position is not empty") // TODO
		this.state.setPiece(action.piece, action.position.x, action.position.y)
		this.switchPlayer()
	}

	private switchPlayer() {
		this.state.currentPlayer = this.state.currentPlayer === NoughtsAndCrossesType.Cross
			? NoughtsAndCrossesType.Nought
			: NoughtsAndCrossesType.Cross
	}
}

export class NoughtsAndCrossesAction {
	piece: NoughtsAndCrossesType.Nought | NoughtsAndCrossesType.Cross
	position: { x: 0 | 1 | 2, y: 0 | 1 | 2 }
}
