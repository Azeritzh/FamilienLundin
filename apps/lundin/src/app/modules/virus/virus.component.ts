import { Component } from "@angular/core"
import { Virus, VirusAction, VirusConfig } from "@lundin/virus"

@Component({
	selector: "lundin-virus",
	templateUrl: "./virus.component.html",
	styleUrls: ["./virus.component.scss"],
})
export class VirusComponent {
	game = new Virus()
	positions: { x: number, y: number }[]
	origin?: { x: number, y: number }
	message = ""
	players = [
		{ name: "Spiller 1", color: "red", playerId: 1 },
		{ name: "Spiller 2", color: "yellow", playerId: 2 },
	]

	constructor() {
		this.positions = []
		for (let y = 0; y < 8; y++)
			for (let x = 0; x < 8; x++)
				this.positions.push({ x, y })
	}

	restart() {
		const config = new VirusConfig(this.players.length)
		this.game = new Virus(config)
		this.message = ""
	}

	select(x: number, y: number) {
		if (!this.origin)
			return this.origin = { x, y }
		const action = new VirusAction(
			this.game.state.currentPlayer,
			this.origin.x,
			this.origin.y,
			x,
			y)
		this.origin = null
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
		const winnerId = this.game.state.findWinner()
		if (winnerId)
			this.message = this.players.find(x => x.playerId === winnerId).name + " har vundet!"
		else
			this.message = ""
	}

	colorFor(position: {x: number, y: number}) {
		const playerId = this.game.state.board.get(position.x, position.y)
		const player = this.players.find(x => x.playerId === playerId)
		return player?.color ?? "white"
	}
}
