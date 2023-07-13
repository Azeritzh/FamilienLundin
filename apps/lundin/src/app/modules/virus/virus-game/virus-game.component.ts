import { Component, ElementRef, HostBinding, Input } from "@angular/core"
import { GameAi, RandomAi } from "@lundin/age"
import { range } from "@lundin/utility"
import { Virus, VirusAction, VirusConfig, generateVirusActions } from "@lundin/virus"

@Component({
	selector: "lundin-virus-game",
	templateUrl: "./virus-game.component.html",
	styleUrls: ["./virus-game.component.scss"],
})
export class VirusGameComponent {
	@Input() players = [
		new VirusPlayer("Spiller 1", "red"),
		new VirusPlayer("Spiller 2", "green", new RandomAi(generateVirusActions)),
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
		return `2rem repeat(${this.game.config.height}, ${this.getFieldSize()})`
	}

	constructor(private elementRef: ElementRef) {
		this.startGame()
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
		this.message = this.getPlayer().name + "'s tur"
	}

	private resetBoard() {
		this.positions = []
		for (const y of range(0, this.boardSize))
			for (const x of range(0, this.boardSize))
				this.positions.push({ x, y })
	}

	select(x: number, y: number) {
		if (!this.origin)
			return this.selectOrigin(x, y)
		const action = new VirusAction(
			this.game.state.currentPlayer,
			this.origin.x,
			this.origin.y,
			x,
			y)
		this.origin = null
		this.performAction(action)
	}

	private selectOrigin(x: number, y: number) {
		const playerAtPosition = this.game.state.board.get(x, y)
		if (playerAtPosition !== this.game.state.currentPlayer)
			return
		this.origin = { x, y }
	}

	private performAction(action: VirusAction) {
		const problems = this.game.update(action)
		if (problems)
			return this.writeProblems(problems)
		const winner = this.game.state.findWinner()
		if (winner)
			this.announceWinner(winner)
		else
			this.announceNextTurn()
	}

	private writeProblems(problems: string[]) {
		this.message = problems.map(this.translateProblem).join("\n")
	}

	private translateProblem(problem: string) {
		switch(problem){
			case "origin must be within board": return "Startfeltet skal være indenfor banen"
			case "must move own piece": return "Man kan ikke flytte andre spilleres brikker"
			case "destination must be within board": return "Destinationen skal være indenfor banen"
			case "destination must be empty": return "Destinationen skal være tom"
			case "must not move too far": return "Man kan ikke flytte længere end to felter"
			default: return problem
		}
	}

	private announceWinner(winner: number) {
		const player = this.getPlayer(winner)
		this.message = player.name + " har vundet!"
	}

	private announceNextTurn() {
		const player = this.getPlayer()
		this.message = player.name + "'s tur"
		if (player.ai)
			setTimeout(() => this.performAction(player.ai.requestActions(this.game)[0]), 10)
	}

	colorFor(position: { x: number, y: number }) {
		const playerNumber = this.game.state.board.get(position.x, position.y)
		if (playerNumber === 0)
			return "white"
		return this.players[playerNumber - 1]?.color ?? "grey"
	}

	isSelected(position: { x: number, y: number }) {
		return this.origin?.x === position.x && this.origin?.y === position.y
	}

	getPlayer(playerNumber: number = this.game.state.currentPlayer) {
		return this.players[playerNumber - 1] ?? new VirusPlayer("Ukendt", "grey")
	}
}

export class VirusPlayer {
	constructor(
		public name: string,
		public color: string,
		public ai: GameAi<Virus, VirusAction> = null
	) { }
}
