import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core"
import { FlagAction, Minestryger, MinestrygerConfig, PlayState, RevealAction, RevealAreaAction } from "@lundin/minestryger"

@Component({
	selector: "lundin-minestryger-game",
	templateUrl: "./minestryger-game.component.html",
	styleUrls: ["./minestryger-game.component.scss"],
})
export class MinestrygerGameComponent implements OnInit, OnDestroy {
	@Input() width = 30
	@Input() height = 16
	@Input() bombs = 99
	@Input() allowFlags = true
	@Input() activateOnMouseDown = false

	@ViewChild("canvas", { static: true }) canvasElement: ElementRef<HTMLCanvasElement>
	get canvas() {
		return this.canvasElement.nativeElement
	}
	game = new Minestryger()
	private context: CanvasRenderingContext2D
	private fieldSize = 20
	remainingBombs = 0
	currentTime: number
	private timerId: number
	private leftMouseDown = false
	private middleMouseDown = false
	private rightMouseDown = false
	private lastHoverPosition?: { x: number, y: number }

	ngOnInit() {
		this.startGame()
		this.timerId = window.setInterval(this.timerUpdate, 1000)
	}

	ngOnDestroy() {
		window.clearInterval(this.timerId)
	}

	private startGame() {
		const config = new MinestrygerConfig(
			this.width,
			this.height,
			this.bombs,
			this.allowFlags,
		)
		this.game = new Minestryger(config)
		this.remainingBombs = this.game.config.bombs
		this.currentTime = 0
		this.resetCanvas()
		this.drawEverything()
	}

	private resetCanvas() {
		this.context = this.canvas.getContext("2d")
		this.canvas.width = this.game.config.width * this.fieldSize
		this.canvas.height = this.game.config.height * this.fieldSize
		this.context.fillStyle = "black"
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
	}

	private drawEverything() {
		for (const { x, y } of this.game.state.board.allFields())
			this.drawField(x, y)
	}

	private drawField(x: number, y: number, hover = false) {
		if (!this.game.state.board.isWithinBounds(x, y))
			return
		const field = this.game.state.board.get(x, y)
		let color = "grey"
		let text = ""
		let textfont = "bold " + (this.fieldSize - 4) + "px arial"
		let textcolor = "black"
		if (field.revealed) {
			if (field.bomb) {
				color = "red"
				text = "💣"
				textfont = this.context.font = (this.fieldSize - 8) + "px serif"
			}
			else {
				color = "white"
				if (field.surroundingBombs) {
					text = field.surroundingBombs.toString()
					textcolor = this.colorForNumber(field.surroundingBombs)
				}
			}
		}
		else {
			if (field.locked) {
				text = "⚑"
				textfont = (this.fieldSize - 4) + "px serif"
				textcolor = "red"
			}
			else if (hover) {
				color = "lightgrey"
			}
		}
		this.drawBox(x, y, text, color, textcolor, textfont)
	}

	private colorForNumber(number: number) {
		switch (number) {
			case 1: return "#0100fe"
			case 2: return "#017f01"
			case 3: return "#fe0000"
			case 4: return "#010080"
			case 5: return "#810102"
			case 6: return "#008081"
			case 7: return "#000000"
			case 8: return "#808080"
		}
	}

	private drawBox(
		x: number,
		y: number,
		text: string,
		color: string,
		textcolor = "black",
		textfont = "bold " + (this.fieldSize - 4) + "px arial"
	) {
		this.context.fillStyle = color
		this.context.fillRect(this.fieldSize * x + 1, this.fieldSize * y + 1, this.fieldSize - 2, this.fieldSize - 2)
		this.context.fillStyle = textcolor
		this.context.font = textfont
		this.context.textAlign = "center"
		this.context.fillText(text, (this.fieldSize) * x + 0.5 * this.fieldSize, (this.fieldSize) * y + 0.80 * this.fieldSize)
	}

	mouseMove(event: MouseEvent) {
		const { x, y } = this.gridPositionFromMousePosition(event)
		this.updateHovering(x, y)
	}

	private updateHovering(x: number, y: number) {
		if (!this.hoverPositionHasChanged(x, y))
			return

		this.redrawLastHoverPosition()
		this.drawField(x, y, true)
		this.showMiddleClickHover(x, y)
		this.lastHoverPosition = { x, y }
	}

	private hoverPositionHasChanged(currentX: number, currentY: number) {
		const lastPosition = this.lastHoverPosition
		return currentX != lastPosition?.x || currentY != lastPosition?.y
	}

	private redrawLastHoverPosition() {
		if (!this.lastHoverPosition)
			return
		const { x, y } = this.lastHoverPosition
		this.drawField(x, y)
		for (const { i, j } of this.game.state.board.fieldsAround(x, y))
			this.drawField(i, j)
	}

	private showMiddleClickHover(x: number, y: number) {
		if (!this.shouldShowMiddleClickHover())
			return
		for (const { i, j, field } of this.game.state.board.fieldsAround(x, y))
			if (!field.locked && !field.revealed)
				this.drawField(i, j, true)
	}

	private shouldShowMiddleClickHover() {
		return (this.leftMouseDown && this.rightMouseDown) || this.middleMouseDown
	}

	updateMouseClick(event: MouseEvent, isDown: boolean) {
		event.preventDefault()
		if (this.hasFinished())
			return

		const { x, y } = this.gridPositionFromMousePosition(event)
		if (this.isLeftButton(event))
			this.handleLeftMouse(isDown, x, y)
		if (this.isMiddleButton(event))
			this.handleMiddleMouse(isDown, x, y)
		if (this.isRightButton(event))
			this.handleRightMouse(isDown, x, y)
		this.updateHovering(x, y)
	}

	private gridPositionFromMousePosition(event: MouseEvent) {
		const rect = this.canvas.getBoundingClientRect()
		const mx = event.clientX - rect.left
		const my = event.clientY - rect.top
		const x = Math.floor(mx / this.fieldSize)
		const y = Math.floor(my / this.fieldSize)
		return { x: x, y: y }
	}

	private hasFinished() {
		return this.game.state.playState === PlayState.Lost || this.game.state.playState === PlayState.Won
	}

	private isLeftButton(event: MouseEvent) {
		return event.button === 0
	}

	private isMiddleButton(event: MouseEvent) {
		return event.button === 1
	}

	private isRightButton(event: MouseEvent) {
		return event.button === 2
	}

	private handleLeftMouse(mouseDown: boolean, x: number, y: number) {
		this.leftMouseDown = mouseDown
		if (this.shouldClickField())
			this.revealField(x, y)
		if (this.rightMouseDown && this.leftMouseDown)
			this.revealSurroundings(x, y)
	}

	private handleMiddleMouse(mouseDown: boolean, x: number, y: number) {
		this.middleMouseDown = mouseDown
		if (!this.middleMouseDown)
			this.revealSurroundings(x, y)
	}

	private handleRightMouse(mouseDown: boolean, x: number, y: number) {
		this.rightMouseDown = mouseDown
		if (this.rightMouseDown && this.leftMouseDown)
			this.revealSurroundings(x, y)
		else if (this.rightMouseDown)
			this.flagField(x, y)
	}

	private shouldClickField() {
		return this.activateOnMouseDown === this.leftMouseDown
	}

	private revealField(x: number, y: number) {
		this.game.update(new RevealAction(x, y))
		//Tjek efter vinder
		this.drawEverything()
	}

	private flagField(x: number, y: number) {
		this.game.update(new FlagAction(x, y))
		this.countRemainingBombs()
		this.drawEverything()
		this.drawField(x, y, true)
	}

	private countRemainingBombs() {
		const lockedFields = [...this.game.state.board.allFields()]
			.map(x => x.field)
			.filter(x => x.locked)
			.length
		this.remainingBombs = this.game.config.bombs - lockedFields
	}

	private revealSurroundings(x: number, y: number) {
		this.game.update(new RevealAreaAction(x, y))
		// tjek vinder
		this.drawEverything()
	}

	private timerUpdate = () => {
		if (this.game.state.finishTime)
			this.currentTime = this.game.state.finishTime / 1000
		else if (this.game.state.startTime)
			this.currentTime = (Date.now() - this.game.state.startTime) / 1000
		else
			this.currentTime = 0
		this.currentTime = Math.floor(this.currentTime)
	}
}
