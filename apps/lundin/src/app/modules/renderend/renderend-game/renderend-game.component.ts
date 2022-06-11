import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core"
import { Renderend } from "@lundin/renderend"
import { RenderendDisplay } from "./renderend-display"
import { RenderendInput } from "./renderend-input"

@Component({
	selector: "lundin-renderend-game",
	template: "<canvas #canvas (click)='clickCanvas($event)'></canvas>",
	styles: [""],
})
export class RenderendGameComponent implements OnInit, OnDestroy {
	game = new Renderend()
	@ViewChild("canvas", { static: true }) canvasElement: ElementRef<HTMLCanvasElement>
	private display: RenderendDisplay
	private inputs: RenderendInput
	private timerId: number
	private updateInterval = 30

	constructor(
		private ngZone: NgZone
	) { }

	ngOnInit() {
		this.display = new RenderendDisplay(this.game, this.canvasElement.nativeElement)
		this.inputs = new RenderendInput(this.canvasElement.nativeElement)
		this.ngZone.runOutsideAngular(() =>
			this.display.startDisplayLoop()
		)
		this.startInterval()
	}

	ngOnDestroy() {
		this.display.onDestroy()
		window.clearInterval(this.timerId)
	}

	private startInterval() {
		this.stopInterval()
		this.ngZone.runOutsideAngular(() =>
			this.timerId = window.setInterval(this.step, this.updateInterval)
		)
	}

	private stopInterval() {
		if (this.timerId)
			window.clearInterval(this.timerId)
		this.timerId = null
	}

	setSize(width: number, height: number) {
		this.display?.setSize(width, height)
	}

	private step = () => {
		this.game.update(...this.inputs.getNewActions())
	}

	restart() {
		this.inputs.restart()
	}

	clickCanvas(event: MouseEvent) {
		this.inputs.clickCanvas(event)
	}
}
