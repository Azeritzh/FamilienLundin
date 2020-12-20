import { Component } from "@angular/core"
import { NoughtsAndCrosses, NoughtsAndCrossesType, NoughtsAndCrossesAction } from "@lundin/noughts-and-crosses"

@Component({
	selector: "lundin-noughts-and-crosses",
	templateUrl: "./noughts-and-crosses.component.html",
	styleUrls: ["./noughts-and-crosses.component.scss"],
})
export class NoughtsAndCrossesComponent {
	game = new NoughtsAndCrosses()
	positions: { x: number, y: number }[]

	constructor() {
		this.positions = []
		for (let y = 0; y < 3; y++)
			for (let x = 0; x < 3; x++)
				this.positions.push({ x, y })
	}

	pieceAt(x: number, y: number) {
		const piece = this.game.state.pieceAt(x, y)
		if (piece === NoughtsAndCrossesType.Cross)
			return "x"
		if (piece === NoughtsAndCrossesType.Nought)
			return "o"
		return ""
	}

	placePiece(x: number, y: number) {
		const action = new NoughtsAndCrossesAction(this.game.state.currentPlayer, x, y)
		this.game.update(action)
	}
}
