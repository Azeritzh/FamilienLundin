import { GameGrid, GameState } from "@lundin/age"

export class NoughtsAndCrossesState implements GameState {
	constructor(
		public board = new GameGrid<NoughtsAndCrossesPiece>(3, 3),
		public currentPlayer: NoughtsAndCrossesPiece.Nought | NoughtsAndCrossesPiece.Cross = NoughtsAndCrossesPiece.Cross,
		public tick: number = 0,
	) { }

	setPiece(piece: NoughtsAndCrossesPiece, x: number, y: number) {
		this.board.set(x,y, piece)
	}

	pieceAt(x: number, y: number) {
		return this.board.get(x,y)
	}

	findWinner() {
		if (this.hasPieceWon(NoughtsAndCrossesPiece.Cross))
			return NoughtsAndCrossesPiece.Cross
		else if (this.hasPieceWon(NoughtsAndCrossesPiece.Nought))
			return NoughtsAndCrossesPiece.Nought
		return null
	}

	private hasPieceWon(piece: NoughtsAndCrossesPiece) {
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
		const isFullRow = (line: NoughtsAndCrossesPiece[]) => line.every(x => x === piece)
		return lines.some(isFullRow)
	}
}

export enum NoughtsAndCrossesPiece { Nought, Cross }
