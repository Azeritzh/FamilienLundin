import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core"
import { Renderend } from "@lundin/renderend"
import { RenderendDisplay } from "./renderend-display"
import { RenderendInput } from "./renderend-input"

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
		this.display = new RenderendDisplay(this.game, this.canvasElement.nativeElement)
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
