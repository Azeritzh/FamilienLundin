import { DisplayConfig } from "../minestryger-display"
import { Minestryger } from "../minestryger"

export class GameElements {
	public canvas: HTMLCanvasElement
	private timerId: number

	constructor(
		public game: Minestryger,
		public config: DisplayConfig,
		public elements: { [index: string]: HTMLElement },
	) {
	}

	getInitialElements() {
		return /*html*/`
<div class="time"></div>
<button type="button" class="button">${this.config.newGameText}</button>
<div class="bombs"></div>
`
	}

	initialise(hostElement: HTMLElement) {
		this.elements["time"] = <HTMLElement>hostElement.getElementsByClassName("time")[0]
		this.elements["button"] = <HTMLElement>hostElement.getElementsByClassName("button")[0]
		this.elements["remaining-bombs"] = <HTMLElement>hostElement.getElementsByClassName("bombs")[0]
		this.timerId = window.setInterval(this.updateTime, 500)
	}

	onDestroy() {
		window.clearInterval(this.timerId)
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
		console.log("locked and bombs:")
		console.log(lockedFields)
		console.log(this.game.config.bombs)
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
