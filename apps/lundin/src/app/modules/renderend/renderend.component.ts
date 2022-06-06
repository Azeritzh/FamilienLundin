import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core"
import { Id } from "@lundin/age"
import { MoveShipAction, Renderend, RenderendAction, StartGameAction } from "@lundin/renderend"
import { Vector2 } from "@lundin/utility"

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
	private context: CanvasRenderingContext2D
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
				return new MoveShipAction(0, -1)
			case "ArrowDown":
			case "s":
				return new MoveShipAction(0, 1)
			case "ArrowRight":
			case "d":
				return new MoveShipAction(1, 0)
			case "ArrowLeft":
			case "a":
				return new MoveShipAction(-1, 0)
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
		this.context = this.canvas.getContext("2d")
		this.context.fillStyle = "white"
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
	}

	private drawEverything() {
		this.context.fillStyle = "white"
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
		for (const entity of this.game.state.entities)
			this.drawEntity(entity)
	}

	private drawEntity(entity: Id) {
		const positioning = this.game.state.positioning.of(entity)
		const forwardVector = Vector2.fromAngle(positioning.orientation).multiply(2)
		const forwardPoint = forwardVector.multiply(2).add(positioning.position)
		const leftPoint = forwardVector.rotate(2).add(positioning.position)
		const rightPoint = forwardVector.rotate(-2).add(positioning.position)

		this.context.strokeStyle = "black"
		this.context.beginPath()
		this.context.moveTo(forwardPoint.x * this.sizeScaling, forwardPoint.y * this.sizeScaling)
		this.context.lineTo(leftPoint.x * this.sizeScaling, leftPoint.y * this.sizeScaling)
		this.context.lineTo(rightPoint.x * this.sizeScaling, rightPoint.y * this.sizeScaling)
		this.context.lineTo(forwardPoint.x * this.sizeScaling, forwardPoint.y * this.sizeScaling)
		this.context.closePath()
		this.context.stroke()
	}

	sizeToWindow() {
		const availableWidth = this.canvasElement.nativeElement.parentElement.clientWidth
		const availableHeight = this.canvasElement.nativeElement.parentElement.clientHeight
		this.canvas.width = availableWidth
		this.canvas.height = availableHeight
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
		this.drawEverything()
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
