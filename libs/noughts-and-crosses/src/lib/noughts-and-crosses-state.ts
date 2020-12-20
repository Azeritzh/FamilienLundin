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

	findWinner() {
		if (this.hasPieceWon(NoughtsAndCrossesType.Cross))
			return NoughtsAndCrossesType.Cross
		else if (this.hasPieceWon(NoughtsAndCrossesType.Nought))
			return NoughtsAndCrossesType.Nought
		return null
	}

	private hasPieceWon(piece: NoughtsAndCrossesType) {
		const lines = [
			[this.pieceAt(0, 0), this.pieceAt(0, 1), this.pieceAt(0, 2)],
			[this.pieceAt(1, 0), this.pieceAt(1, 1), this.pieceAt(1, 2)],
			[this.pieceAt(2, 0), this.pieceAt(2, 1), this.pieceAt(2, 2)],
			[this.pieceAt(0, 0), this.pieceAt(1, 0), this.pieceAt(2, 0)],
			[this.pieceAt(0, 1), this.pieceAt(1, 1), this.pieceAt(2, 1)],
			[this.pieceAt(0, 2), this.pieceAt(1, 2), this.pieceAt(2, 2)],
			[this.pieceAt(0, 0), this.pieceAt(1, 1), this.pieceAt(2, 2)],
			[this.pieceAt(0, 2), this.pieceAt(1, 1), this.pieceAt(2, 0)],
		]
		const isFullRow = (line: NoughtsAndCrossesType[]) => line.every(x => x === piece)
		return lines.some(isFullRow)
	}
}

export enum NoughtsAndCrossesType { None, Nought, Cross }
