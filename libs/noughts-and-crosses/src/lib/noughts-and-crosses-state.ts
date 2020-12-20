import { GameState } from "@lundin/age"

export class NoughtsAndCrossesState implements GameState {
	constructor(
		public board: NoughtsAndCrossesType[] = null,
		public tick: number = 0,
	) {
		if (!board)
			this.initialiseBoard()
	}

	private initialiseBoard() {
		this.board = []
		for (let i = 0; i < 9; i++)
			this.board.push(NoughtsAndCrossesType.None)
	}
}

export enum NoughtsAndCrossesType { None, Nought, Cross }
