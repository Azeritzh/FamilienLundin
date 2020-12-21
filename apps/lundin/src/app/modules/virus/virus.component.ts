import { Component } from "@angular/core"
import { Virus, VirusAction } from "@lundin/virus"

@Component({
	selector: "lundin-virus",
	templateUrl: "./virus.component.html",
	styleUrls: ["./virus.component.scss"],
})
export class VirusComponent {
	game = new Virus()
	positions: { x: number, y: number }[]
	message = ""

	constructor() {
		this.positions = []
		for (let y = 0; y < 8; y++)
			for (let x = 0; x < 8; x++)
				this.positions.push({ x, y })
	}

	restart() {
		this.game = new Virus()
		this.message = ""
	}

	pieceAt(x: number, y: number) {
		return this.game.state.board.get(x, y)
	}

	placePiece(x: number, y: number) {
		const action = new VirusAction(this.game.state.currentPlayer, 0, 0, x, y)
		const validation = this.game.update(action)
		if (!validation.isValid)
			this.writeProblems(validation.problems)
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
