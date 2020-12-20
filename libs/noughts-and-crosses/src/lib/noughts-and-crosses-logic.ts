import { GameLogic } from "@lundin/age"
import { NoughtsAndCrossesState, NoughtsAndCrossesType } from "./noughts-and-crosses-state"

export class NoughtsAndCrossesLogic implements GameLogic<NoughtsAndCrossesAction> {
	constructor(private readonly state: NoughtsAndCrossesState) { }

	update(actions: NoughtsAndCrossesAction[]): void {
		const action = actions[0]
		if (action.piece !== this.state.currentPlayer)
			throw new Error(`Not ${action.piece}'s turn`) // TODO
		if (this.state.pieceAt(action.x, action.y) !== NoughtsAndCrossesType.None)
			throw new Error("Position is not empty") // TODO
		this.state.setPiece(action.piece, action.x, action.y)
		this.switchPlayer()
	}

	private switchPlayer() {
		this.state.currentPlayer = this.state.currentPlayer === NoughtsAndCrossesType.Cross
			? NoughtsAndCrossesType.Nought
			: NoughtsAndCrossesType.Cross
	}
}

export class NoughtsAndCrossesAction {
	constructor(
		public piece: NoughtsAndCrossesType.Nought | NoughtsAndCrossesType.Cross,
		public x: number,
		public y: number,
	) { }
}
