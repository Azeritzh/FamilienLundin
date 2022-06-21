import { BaseDisplay } from "./base-display"
import { BaseGame } from "./base-game"
import { BaseInput } from "./base-input"

export class GameRunner<Action> {
	private timerId: number
	private updateInterval = 30
	private lastUpdate = Date.now()
	private stop = false

	constructor(
		private display: BaseDisplay,
		private inputs: BaseInput<Action>,
		private game: BaseGame<Action>,
	) { }

	startGameLoop() {
		this.stopInterval()
		this.timerId = window.setInterval(this.updateGame, this.updateInterval)
	}

	private stopInterval() {
		if (this.timerId)
			window.clearInterval(this.timerId)
		this.timerId = null
	}

	updateGame = () => {
		this.game.update(...this.inputs.getNewActions())
		this.lastUpdate = Date.now()
	}

	startDisplayLoop = () => {
		this.updateDisplay()
		console.log("display")
		if (!this.stop)
			requestAnimationFrame(this.startDisplayLoop)
	}

	updateDisplay() {
		const now = Date.now()
		const fractionOfTick = (now - this.lastUpdate) / this.updateInterval
		this.display.show(fractionOfTick)
	}

	onDestroy() {
		this.stop = true
		window.clearInterval(this.timerId)
		this.display.onDestroy?.()
	}
}
