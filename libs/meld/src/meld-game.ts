import { Meld } from "./meld"
import { DisplayConfig, MeldDisplay } from "./meld-display"
import { MeldInput } from "./meld-input"

export class MeldGame {
	private display: MeldDisplay
	private inputs: MeldInput
	private timerId: number
	private updateInterval = 30
	private lastUpdate = Date.now()
	private stop = false

	constructor(
		hostElement: HTMLElement,
		displayConfig: DisplayConfig,
		public game = new Meld(),
	) {
		hostElement.style.position = "relative"
		const canvas = document.createElement("canvas")
		canvas.style.position = "absolute"
		hostElement.appendChild(canvas)
		this.display = new MeldDisplay(displayConfig, this.game, canvas)
		this.inputs = new MeldInput(canvas)
		this.inputs.restart()
		this.updateGame()
	}

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
		if (!this.stop)
			requestAnimationFrame(this.startDisplayLoop)
	}

	updateDisplay() {
		const now = Date.now()
		const fractionOfTick = (now - this.lastUpdate) / 30
		this.display.show(fractionOfTick)
	}

	setSize(width: number, height: number) {
		this.display?.setSize(width, height)
	}

	onDestroy() {
		this.stop = true
		window.clearInterval(this.timerId)
	}
}
