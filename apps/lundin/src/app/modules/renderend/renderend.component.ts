import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core"
import { Id, typeOf } from "@lundin/age"
import { MoveShipHorisontallyAction, MoveShipVerticallyAction, Renderend, RenderendAction, StartGameAction } from "@lundin/renderend"
import { InputState, KeyStates } from "@lundin/utility"
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
	private nextActions: RenderendAction[] = [new StartGameAction()]
	private keyStates = new KeyStates()

	constructor(
		private ngZone: NgZone
	) { }

	ngOnInit() {
		this.resetCanvas()
		this.startInterval()
	}

	ngOnDestroy() {
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

	private resetCanvas() {
		this.sizeToWindow()
		this.display = new WebGl2Display(this.canvas, 16, 160)
		this.display.addSprite("ship", "assets/images/renderend/ship.png", 16, 16)
		this.display.addSprite("obstacle", "assets/images/renderend/obstacle.png", 16, 16)
		this.display.addSprite("background", "assets/images/renderend/starry-background.png", 220, 160)
	}

	private sizeToWindow() {
		const availableWidth = this.canvasElement.nativeElement.parentElement.clientWidth
		const availableHeight = this.canvasElement.nativeElement.parentElement.clientHeight
		this.canvas.width = availableWidth
		this.canvas.height = availableHeight
	}

	private drawEverything() {
		this.display.startFrame()
		this.drawBackground()
		for (const entity of this.game.entities)
			this.drawEntity(entity)
		this.display.endFrame()
	}

	private drawBackground() {
		const backgroundWidth = 220 / 16
		const speedFactor = 0.5
		const offset = (-this.game.state.globals.distanceTravelled * speedFactor) % backgroundWidth
		this.display.drawSprite("background", offset, 0, 0, 0)
		this.display.drawSprite("background", offset + backgroundWidth, 0, 0, 0)
		this.display.drawSprite("background", offset + backgroundWidth * 2, 0, 0, 0)
	}

	private drawEntity(entity: Id) {
		const pos = this.game.access.position.of(entity)
		const sprite = typeOf(entity) == this.game.config.constants.shipType
			? "ship"
			: "obstacle"
		// These are how the sprite should be offset in comparison to the entity's center point
		// It's just hardcoded for now, so sprites of size 1x1 will center on the entity's center point
		const offsetX = -0.5
		const offsetY = -0.5
		this.display.drawSprite(sprite, pos.x + offsetX, pos.y + offsetY, 0, 0)
	}

	private step = () => {
		this.nextActions.push(...this.parseInputs(this.keyStates.getInputState()))
		this.game.update(...this.nextActions)
		this.nextActions = []
		this.drawEverything()
	}

	private parseInputs(inputState: InputState) {
		return [
			this.getVerticalAction(inputState),
			this.getHorisontalAction(inputState),
		]
	}

	private getVerticalAction(inputState: InputState) {
		const up = this.changesFor(inputState, "w", "ArrowUp")
		if (up === true)
			return new MoveShipVerticallyAction(-0.1)
		if (up === false)
			return new MoveShipVerticallyAction(0)
		const down = this.changesFor(inputState, "s", "ArrowDown")
		if (down === true)
			return new MoveShipVerticallyAction(0.1)
		if (down === false)
			return new MoveShipVerticallyAction(0)
	}

	private changesFor(inputState: InputState, ...keys: string[]) {
		for (const key of keys)
			if (inputState[key]?.hasChanged)
				return inputState[key].state
		return null
	}

	private getHorisontalAction(inputState: InputState) {
		const left = this.stateFor(inputState, "a", "ArrowLeft")
		if (left)
			return new MoveShipHorisontallyAction(-0.01)
		const right = this.stateFor(inputState, "d", "ArrowRight")
		if (right)
			return new MoveShipHorisontallyAction(0.01)
	}

	private stateFor(inputState: InputState, ...keys: string[]) {
		for (const key of keys)
			if (inputState[key]?.state)
				return true
		return false
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
		this.nextActions.push(new StartGameAction())
	}
}
