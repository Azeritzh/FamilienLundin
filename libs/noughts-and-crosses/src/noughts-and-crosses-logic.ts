import { GameLogic } from "@lundin/age"
import { NoughtsAndCrossesState, NoughtsAndCrossesPiece } from "./noughts-and-crosses-state"

export class NoughtsAndCrossesLogic implements GameLogic<NoughtsAndCrossesAction> {
	constructor(private readonly state: NoughtsAndCrossesState) { }

	Update(actions: NoughtsAndCrossesAction[]): void {
		const action = actions[0]
		this.state.setPiece(action.piece, action.x, action.y)
		this.switchPlayer()
	}

	private switchPlayer() {
		this.state.currentPlayer = this.state.currentPlayer === NoughtsAndCrossesPiece.Cross
			? NoughtsAndCrossesPiece.Nought
			: NoughtsAndCrossesPiece.Cross
	}
}

export class NoughtsAndCrossesAction {
	constructor(
		public piece: NoughtsAndCrossesPiece.Nought | NoughtsAndCrossesPiece.Cross,
		public x: number,
		public y: number,
	) { }
}
