import { DisplayConfig, Renderend, RenderendDisplay, RenderendInput } from "@lundin/renderend"

export class MeldGame {
	private display: RenderendDisplay
	private inputs: RenderendInput
	private timerId: number
	private updateInterval = 30
	private lastUpdate = Date.now()
	private stop = false

	constructor(
		hostElement: HTMLElement,
		displayConfig: DisplayConfig,
		public game = new Renderend(),
	) {
		hostElement.style.position = "relative"
		const canvas = document.createElement("canvas")
		canvas.style.position = "absolute"
		hostElement.appendChild(canvas)
		this.display = new RenderendDisplay(displayConfig, this.game, canvas)
		this.inputs = new RenderendInput(canvas)
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
