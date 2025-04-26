import { BaseDisplay } from "./base-display"
import { BaseGame } from "./base-game"
import { finishTiming, startTiming } from "./services/performance"

export class GameRunner<Action> {
	private timerId: number | null = null
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
		startTiming("gameUpdate")
		this.game.Update(...this.actions.splice(0), ...this.display.getNewActions())
		this.afterGameUpdate()
		finishTiming("gameUpdate")
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
		startTiming("displayUpdate")
		const now = Date.now()
		const updateInterval = 1000 / this.updatesPerSecond
		const fractionOfTick = (now - this.lastUpdate) / updateInterval
		this.display.show(fractionOfTick)
		finishTiming("displayUpdate")
	}

	onDestroy() {
		this.stop = true
		if (this.timerId)
			window.clearInterval(this.timerId)
		this.display.onDestroy?.()
	}
}
