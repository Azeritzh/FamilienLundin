import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core"
import { FlagAction, Minestryger, PlayState, RevealAction } from "@lundin/minestryger"

@Component({
	selector: "lundin-minestryger-game",
	templateUrl: "./minestryger-game.component.html",
	styleUrls: ["./minestryger-game.component.scss"],
})
export class MinestrygerGameComponent implements OnInit, OnDestroy {
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
	private activateOnMouseDown = false

	ngOnInit() {
		this.startGame()
		this.timerId = window.setInterval(this.timerUpdate, 1000)
	}

	ngOnDestroy() {
		window.clearInterval(this.timerId)
	}

	private startGame() {
		this.game = new Minestryger()
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
				if (field.surroundingBombs == 0) {
					text = ""
				}
				else {
					text = field.surroundingBombs.toString()
					switch (field.surroundingBombs) {
						case 1: textcolor = "#0100fe"; break
						case 2: textcolor = "#017f01"; break
						case 3: textcolor = "#fe0000"; break
						case 4: textcolor = "#010080"; break
						case 5: textcolor = "#810102"; break
						case 6: textcolor = "#008081"; break
						case 7: textcolor = "#000"; break
						case 8: textcolor = "#808080"; break
					}
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

	mouseDown(event: MouseEvent) {
		event.preventDefault()
		if (this.hasFinished())
			return

		const pos = this.gridPositionFromMousePosition(event)
		if (this.isLeftButton(event))
			this.handleLeftMouse(true, pos.x, pos.y)
		if (this.isMiddleButton(event))
			this.handleMiddleMouse(true, pos.x, pos.y)
		if (this.isRightButton(event))
			this.handleRightMouse(true, pos.x, pos.y)
		//this.showMiddleClickHover(pos)
	}

	mouseUp(event: MouseEvent) {
		event.preventDefault()
		if (this.hasFinished())
			return

		const pos = this.gridPositionFromMousePosition(event)
		if (this.isLeftButton(event))
			this.handleLeftMouse(false, pos.x, pos.y)
		if (this.isMiddleButton(event))
			this.handleMiddleMouse(false, pos.x, pos.y)
		if (this.isRightButton(event))
			this.handleRightMouse(false, pos.x, pos.y)
		//this.resetLastHoverPosition()
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
	}

	private countRemainingBombs() {
		const lockedFields = [...this.game.state.board.allFields()]
			.map(x => x.field)
			.filter(x => x.locked)
			.length
		this.remainingBombs = this.game.config.bombs - lockedFields
	}

	private revealSurroundings(x: number, y: number) {
		//
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
