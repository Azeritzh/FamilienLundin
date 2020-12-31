import { Component, ElementRef, HostBinding, Input } from "@angular/core"
import { range } from "@lundin/utility"
import { Virus, VirusAction, VirusConfig } from "@lundin/virus"

@Component({
	selector: "lundin-virus-game",
	templateUrl: "./virus-game.component.html",
	styleUrls: ["./virus-game.component.scss"],
})
export class VirusGameComponent {
	@Input() players = [
		new VirusPlayer("Spiller 1", "red", 1),
		new VirusPlayer("Spiller 2", "green", 2),
	]
	@Input() boardSize = 8
	@Input() fieldSize = 50
	@Input() autoSize = true
	
	game = new Virus()
	positions: { x: number, y: number }[]
	origin?: { x: number, y: number }
	message = ""

	@HostBinding("style.grid-template-columns") get columns() {
		return `repeat(${this.game.config.width}, ${this.getFieldSize()})`
	}
	@HostBinding("style.grid-template-rows") get rows() {
		return `repeat(${this.game.config.height}, ${this.getFieldSize()}) 2rem`
	}

	constructor(private elementRef: ElementRef) {
		this.startGame()
		this.message = this.currentPlayerMessage()
	}

	private getFieldSize() {
		if (!this.autoSize)
			return this.fieldSize + "px"
		const element = this.elementRef?.nativeElement
		if (!element)
			return "2rem"
		const width = window.innerWidth * 0.8
		const height = window.innerHeight * 0.8
		const horisontalFieldSize = Math.floor(width / this.game.config.width)
		const verticalFieldSize = Math.floor(height / this.game.config.height)
		return Math.min(horisontalFieldSize, verticalFieldSize) + "px"
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

export class VirusPlayer {
	constructor(
		public name: string,
		public color: string,
		public playerId: number,
	) { }
}
