import { Component, HostBinding, Input } from "@angular/core"
import { range } from "@lundin/utility"
import { Virus, VirusAction, VirusConfig } from "@lundin/virus"

@Component({
	selector: "lundin-virus-game",
	templateUrl: "./virus-game.component.html",
	styleUrls: ["./virus-game.component.scss"],
})
export class VirusGameComponent {
	game = new Virus()
	positions: { x: number, y: number }[]
	origin?: { x: number, y: number }
	message = ""
	players = [
		{ name: "Spiller 1", color: "red", playerId: 1 },
		{ name: "Spiller 2", color: "green", playerId: 2 },
	]
	@Input() boardSize = 8
	@Input() fieldSize = 20
	@Input() autoSize = true

	@HostBinding("style.grid-template-columns") get columns() {
		return `repeat(${this.game.config.width}, 2rem)`
	}
	@HostBinding("style.grid-template-rows") get rows() {
		return `repeat(${this.game.config.height + 1}, 2rem)`
	}

	constructor() {
		this.startGame()
		this.message = this.currentPlayerMessage()
	}

	startGame() {
		this.resetBoard()
		const config = new VirusConfig(
			this.players.length,
			this.boardSize,
			this.boardSize)
		this.game = new Virus(config)
		this.message = ""
	}

	private resetBoard() {
		this.positions = []
		for (const y of range(0, this.boardSize))
			for (const x of range(0, this.boardSize))
				this.positions.push({ x, y })
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
		const winner = this.game.state.findWinner()
		if (winner)
			this.message = this.winnerMessage(winner)
		else
			this.message = this.currentPlayerMessage()
	}

	private winnerMessage(winnerId: number) {
		const player = this.players.find(x => x.playerId === winnerId)
		return player.name + " har vundet!"
	}

	private currentPlayerMessage() {
		const playerId = this.game.state.currentPlayer
		const player = this.players.find(x => x.playerId === playerId)
		return player.name + "'s tur"
	}

	colorFor(position: { x: number, y: number }) {
		const playerId = this.game.state.board.get(position.x, position.y)
		const player = this.players.find(x => x.playerId === playerId)
		return player?.color ?? "white"
	}

	isSelected(position: { x: number, y: number }) {
		return this.origin?.x === position.x && this.origin?.y === position.y
	}

	addPlayer() {
		this.players.push({ name: "Spiller 3", color: "blue", playerId: 3 })
	}
}
