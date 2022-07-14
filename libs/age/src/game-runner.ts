import { BaseDisplay } from "./base-display"
import { BaseGame } from "./base-game"

export class GameRunner<Action> {
	private timerId: number
	private lastUpdate = Date.now()
	private stop = false
	actions: Action[] = []

	constructor(
		private display: BaseDisplay<Action>,
		private game: BaseGame<Action>,
		private updatesPerSecond = 30,
	) { }

	startGameLoop() {
		this.stopInterval()
		this.timerId = window.setInterval(this.updateGame, 1000 / this.updatesPerSecond)
	}

	private stopInterval() {
		if (this.timerId)
			window.clearInterval(this.timerId)
		this.timerId = null
	}

	updateGame = () => {
		//const start = performance.now()
		this.game.update(...this.actions.splice(0), ...this.display.getNewActions())
		this.afterGameUpdate()
		//console.log(performance.now() - start)
		this.lastUpdate = Date.now()
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	protected afterGameUpdate = () => { }

	startDisplayLoop = () => {
		this.updateDisplay()
		if (!this.stop)
			requestAnimationFrame(this.startDisplayLoop)
	}

	updateDisplay() {
		const now = Date.now()
		const updateInterval = 1000 / this.updatesPerSecond
		const fractionOfTick = (now - this.lastUpdate) / updateInterval
		this.display.show(fractionOfTick)
	}

	onDestroy() {
		this.stop = true
		window.clearInterval(this.timerId)
		this.display.onDestroy?.()
	}
}
