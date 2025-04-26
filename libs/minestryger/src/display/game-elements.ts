import { DisplayConfig } from "../minestryger-display"
import { Minestryger } from "../minestryger"

export class GameElements {
	public canvas!: HTMLCanvasElement
	private timerId: number | null = null

	constructor(
		public game: Minestryger,
		public config: DisplayConfig,
		public elements: { [index: string]: HTMLElement },
	) {
	}

	getInitialElements() {
		return /*html*/`
<div id="time"></div>
<button type="button" id="new-game-button">${this.config.text.newGame}</button>
<div id="remaining-bombs"></div>
`
	}

	initialise() {
		this.elements["time"] = document.getElementById("time")!
		this.elements["button"] = document.getElementById("new-game-button")!
		this.elements["remaining-bombs"] = document.getElementById("remaining-bombs")!
		this.timerId = window.setInterval(this.updateTime, 500)
	}

	onDestroy() {
		window.clearInterval(this.timerId!)
	}

	show() {
		this.updateRemainingBombs()
		this.updateTime()
	}

	private updateRemainingBombs() {
		const lockedFields = [...this.game.state.board.allFields()]
			.map(x => x.field)
			.filter(x => x.locked)
			.length
		this.elements["remaining-bombs"].innerText = "" + (this.game.config.bombs - lockedFields)
	}

	private updateTime = () => {
		this.elements["time"].innerText = "" + Math.floor(this.getCurrentTime())
	}

	private getCurrentTime() {
		if (this.game.state.finishTime !== null)
			return this.game.state.finishTime / 1000
		else if (this.game.state.startTime)
			return (Date.now() - this.game.state.startTime) / 1000
		else
			return 0
	}
}
