import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core"
import { Id, typeOf } from "@lundin/age"
import { MoveShipAction, Renderend, RenderendAction, StartGameAction } from "@lundin/renderend"
import { WebGl2Display } from "@lundin/web-gl-display"

@Component({
	selector: "lundin-renderend",
	templateUrl: "./renderend.component.html",
	styleUrls: ["./renderend.component.scss"],
})
export class RenderendComponent implements OnInit, OnDestroy {
	game = new Renderend()
	@ViewChild("canvas", { static: true }) canvasElement: ElementRef<HTMLCanvasElement>
	get canvas() {
		return this.canvasElement.nativeElement
	}
	private display: WebGl2Display
	private timerId: number
	private sizeScaling = 4
	private updateInterval = 30
	private nextAction: RenderendAction = new StartGameAction()

	constructor(
		private ngZone: NgZone
	) { }

	ngOnInit() {
		this.resetCanvas()
		this.setupInput()
		this.drawEverything()
		this.startInterval()
	}

	ngOnDestroy() {
		window.clearInterval(this.timerId)
	}

	private setupInput() {
		window.addEventListener("keydown", x => {
			this.nextAction = this.getActionFor(x.key)
		})
	}

	private getActionFor(key: string) {
		switch (key) {
			case "ArrowUp":
			case "w":
				return new MoveShipAction(0, -0.1)
			case "ArrowDown":
			case "s":
				return new MoveShipAction(0, 0.1)
			case "ArrowRight":
			case "d":
				return new MoveShipAction(0.1, 0)
			case "ArrowLeft":
			case "a":
				return new MoveShipAction(-0.1, 0)
		}
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

	private resetCanvas() {
		this.sizeToWindow()
		this.display = new WebGl2Display(this.canvas, 16, 180)
		this.display.addSprite("ship", "assets/images/ship.png", 16, 16)
		this.display.addSprite("obstacle", "assets/images/obstacle.png", 16, 16)
	}

	private sizeToWindow() {
		const availableWidth = this.canvasElement.nativeElement.parentElement.clientWidth
		const availableHeight = this.canvasElement.nativeElement.parentElement.clientHeight
		this.canvas.width = availableWidth
		this.canvas.height = availableHeight
	}

	private drawEverything() {
		this.display.startFrame()
		for (const entity of this.game.entities)
			this.drawEntity(entity)
		this.display.endFrame()
	}

	private drawEntity(entity: Id) {
		const pos = this.game.access.position.of(entity)
		const sprite = typeOf(entity) == this.game.config.constants.shipType
			? "ship"
			: "obstacle"
		this.display.drawSprite(sprite, pos.x, pos.y, 0, 0)
	}

	private step = () => {
		this.game.update(this.nextAction)
		this.nextAction = undefined
		this.drawEverything()
	}

	clickCanvas(event: MouseEvent) {
		event.preventDefault()
		const { x, y } = this.gridPositionFromMousePosition(event)
		console.log("x: {0}, y: {1}", x, y)
		// this.game.config.click(x, y)
	}

	private gridPositionFromMousePosition(event: MouseEvent) {
		const rect = this.canvas.getBoundingClientRect()
		const mx = event.clientX - rect.left
		const my = event.clientY - rect.top
		const x = mx / this.sizeScaling
		const y = my / this.sizeScaling
		return { x, y }
	}

	restart() {
		this.nextAction = new StartGameAction()
	}
}
