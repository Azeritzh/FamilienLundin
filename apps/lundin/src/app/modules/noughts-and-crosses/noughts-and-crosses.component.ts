import { Component } from "@angular/core"
import { NoughtsAndCrosses, NoughtsAndCrossesPiece, NoughtsAndCrossesAction } from "@lundin/noughts-and-crosses"

@Component({
	selector: "lundin-noughts-and-crosses",
	templateUrl: "./noughts-and-crosses.component.html",
	styleUrls: ["./noughts-and-crosses.component.scss"],
	standalone: false,
})
export class NoughtsAndCrossesComponent {
	game = new NoughtsAndCrosses()
	positions: { x: number, y: number }[]
	message = ""

	constructor() {
		this.positions = []
		for (let y = 0; y < 3; y++)
			for (let x = 0; x < 3; x++)
				this.positions.push({ x, y })
	}

	restart() {
		this.game = new NoughtsAndCrosses()
		this.message = ""
	}

	pieceAt(x: number, y: number) {
		const piece = this.game.state.pieceAt(x, y)
		if (piece === NoughtsAndCrossesPiece.Cross)
			return "x"
		if (piece === NoughtsAndCrossesPiece.Nought)
			return "o"
		return ""
	}

	placePiece(x: number, y: number) {
		const action = new NoughtsAndCrossesAction(this.game.state.currentPlayer, x, y)
		const problems = this.game.update(action)
		if (problems)
			this.writeProblems(problems)
		else
			this.checkWinner()
	}

	private writeProblems(problems: string[]) {
		this.message = problems.join("\n")
	}

	private checkWinner() {
		const winner = this.game.state.findWinner()
		if (winner)
			this.message = winner.toString() + " har vundet!"
		else
			this.message = ""
	}
}
