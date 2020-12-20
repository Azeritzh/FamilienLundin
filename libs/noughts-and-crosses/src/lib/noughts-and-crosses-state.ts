import { GameState } from "@lundin/age"

export class NoughtsAndCrossesState implements GameState {
	constructor(
		public board: NoughtsAndCrossesType[] = null,
		public currentPlayer: NoughtsAndCrossesType.Nought | NoughtsAndCrossesType.Cross = NoughtsAndCrossesType.Cross,
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

	setPiece(piece: NoughtsAndCrossesType, x: number, y: number) {
		this.board[this.indexFor(x, y)] = piece
	}

	private indexFor(x: number, y: number) {
		return x * 3 + y
	}

	pieceAt(x: number, y: number) {
		return this.board[this.indexFor(x, y)]
	}
}

export enum NoughtsAndCrossesType { None, Nought, Cross }
