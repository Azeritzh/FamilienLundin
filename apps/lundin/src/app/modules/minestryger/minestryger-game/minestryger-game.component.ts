import { Component, ElementRef, ViewChild } from "@angular/core"
import { Minestryger, RevealAction } from "@lundin/minestryger"

@Component({
	selector: "lundin-minestryger-game",
	templateUrl: "./minestryger-game.component.html",
	styleUrls: ["./minestryger-game.component.scss"],
})
export class MinestrygerGameComponent {
	@ViewChild("canvas", { static: true }) canvasElement: ElementRef<HTMLCanvasElement>
	get canvas() {
		return this.canvasElement.nativeElement
	}
	game = new Minestryger()
	context: CanvasRenderingContext2D
	size = 20
	timerId: number
	leftMouseDown = false
	middleMouseDown = false
	rightMouseDown = false
	activateOnMouseDown = false

	ngOnInit() {
		this.context = this.canvas.getContext("2d")
		this.canvas.width = this.game.state.board.width * this.size
		this.canvas.height = this.game.state.board.height * this.size
		this.context.fillStyle = "black"
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
		for (const { x, y } of this.game.state.board.allFields())
			this.drawField(x, y)
	}

	drawField(x: number, y: number, hover = false) {
		const field = this.game.state.board.get(x, y)
		let color = "grey"
		let text = ""
		let textfont = "bold " + (this.size - 4) + "px arial"
		let textcolor = "black"
		if (field.revealed) {
			if (field.bomb) {
				color = "red"
				text = "💣"
				textfont = this.context.font = (this.size - 8) + "px serif"
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
				textfont = (this.size - 4) + "px serif"
				textcolor = "red"
			}
			else if (hover) {
				color = "lightgrey"
			}
		}
		this.drawBox(x, y, text, color, textcolor, textfont)
	}

	drawBox(
		x: number,
		y: number,
		text: string,
		color: string,
		textcolor = "black",
		textfont = "bold " + (this.size - 4) + "px arial"
	) {
		this.context.fillStyle = color
		this.context.fillRect(this.size * x + 1, this.size * y + 1, this.size - 2, this.size - 2)
		this.context.fillStyle = textcolor
		this.context.font = textfont
		this.context.textAlign = "center"
		this.context.fillText(text, (this.size) * x + 0.5 * this.size, (this.size) * y + 0.80 * this.size)
	}

	mouseDown(event: MouseEvent) {
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

	gridPositionFromMousePosition(event: MouseEvent) {
		const rect = this.canvas.getBoundingClientRect()
		const mx = event.clientX - rect.left
		const my = event.clientY - rect.top
		const x = Math.floor(mx / this.size)
		const y = Math.floor(my / this.size)
		return { x: x, y: y }
	}

	hasFinished() {
		return false
	}

	isLeftButton(event: MouseEvent) {
		return event.button === 0
	}

	isMiddleButton(event: MouseEvent) {
		return event.button === 1
	}

	isRightButton(event: MouseEvent) {
		return event.button === 2
	}

	handleLeftMouse(mouseDown: boolean, x: number, y: number) {
		this.leftMouseDown = mouseDown
		if (this.shouldClickField())
			this.clickField(x, y)
		if (this.rightMouseDown && this.leftMouseDown)
			this.revealSurroundings(x, y)
	}

	handleMiddleMouse(mouseDown: boolean, x: number, y: number) {
		this.middleMouseDown = mouseDown
		if (!this.middleMouseDown)
			this.revealSurroundings(x, y)
	}

	handleRightMouse(mouseDown: boolean, x: number, y: number) {
		this.rightMouseDown = mouseDown
		if (this.rightMouseDown && this.leftMouseDown)
			this.revealSurroundings(x, y)
	}

	shouldClickField() {
		return this.activateOnMouseDown === this.leftMouseDown
	}

	clickField(x: number, y: number) {
		if (!this.isTimerRunning())
			this.firstClick(x, y)
		this.revealField(x, y)
	}

	isTimerRunning() {
		return this.timerId !== undefined
	}

	firstClick(x: number, y: number) {
		this.game.state.generateAround(x, y)
		this.timerId = 1
		//Opsæt ny bane
		//Start timer
	}

	revealSurroundings(x: number, y: number) {
		//
	}

	revealField(x: number, y: number) {
		this.game.update(new RevealAction(x, y))
		//game.reveal xy
		//Tjek efter vinder
		for (const { x, y } of this.game.state.board.allFields())
			this.drawField(x, y)
	}
}
