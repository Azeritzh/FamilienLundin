import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core"
import { DisplayConfig, Renderend, RenderendDisplay, RenderendInput } from "@lundin/renderend"

@Component({
	selector: "lundin-renderend-game",
	template: "<canvas #canvas (click)='clickCanvas($event)'></canvas>",
	styles: [":host{ position: relative } canvas{ position: absolute; }"],
})
export class RenderendGameComponent implements OnInit, OnDestroy {
	game = new Renderend()
	@ViewChild("canvas", { static: true }) canvasElement: ElementRef<HTMLCanvasElement>
	private display: RenderendDisplay
	private inputs: RenderendInput
	private timerId: number
	private updateInterval = 30
	private lastUpdate = Date.now()
	private stop = false

	constructor(
		private ngZone: NgZone
	) { }

	ngOnInit() {
		this.display = new RenderendDisplay(displayConfig, this.game, this.canvasElement.nativeElement)
		this.inputs = new RenderendInput(this.canvasElement.nativeElement)
		this.startInterval()
	}

	ngOnDestroy() {
		this.stop = true
		window.clearInterval(this.timerId)
	}

	private startInterval() {
		this.stopInterval()
		this.ngZone.runOutsideAngular(() => {
			this.timerId = window.setInterval(this.step, this.updateInterval)
			this.updateDisplay()
		})
	}

	private stopInterval() {
		if (this.timerId)
			window.clearInterval(this.timerId)
		this.timerId = null
	}

	private updateDisplay = () => {
		const now = Date.now()
		const fractionOfTick = (now - this.lastUpdate) / 30
		this.display.show(fractionOfTick)
		if (!this.stop)
			requestAnimationFrame(this.updateDisplay)
	}

	setSize(width: number, height: number) {
		this.display?.setSize(width, height)
	}

	private step = () => {
		this.game.update(...this.inputs.getNewActions())
		this.lastUpdate = Date.now()
	}

	restart() {
		this.inputs.restart()
	}

	clickCanvas(event: MouseEvent) {
		this.inputs.clickCanvas(event)
	}
}

const displayConfig: DisplayConfig = {
	font: "Vt323",
	sprites: {
		"ship": {
			url: "assets/images/renderend/ship.png",
			width: 16,
			height: 16,
		},
		"wall": {
			url: "assets/images/renderend/wall.png",
			width: 16,
			height: 16,
		},
		"obstacle": {
			url: "assets/images/renderend/obstacle.png",
			width: 16,
			height: 16,
		},
		"big-obstacle": {
			url: "assets/images/renderend/big-obstacle.png",
			width: 32,
			height: 32,
		},
		"background": {
			url: "assets/images/renderend/starry-background.png",
			width: 220,
			height: 160,
			centerX: 0,
			centerY: 0,
		},
	},
}