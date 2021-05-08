import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core"
import { Field, FieldType, Kingdoms } from "@lundin/kingdoms"
import { hexesAdjacentTo } from "@lundin/utility"
import { DisplayState } from "./display-state"

@Component({
	selector: "lundin-kingdoms-display",
	templateUrl: "./kingdoms-display.component.html",
})
export class KingdomsDisplayComponent implements OnInit {
	@Input() game = new Kingdoms()
	@Input() displayState = new DisplayState()
	@Output() clickField = new EventEmitter<FieldSelection>()
	@ViewChild("canvas", { static: true }) canvasElement: ElementRef<HTMLCanvasElement>
	get canvas() {
		return this.canvasElement.nativeElement
	}
	private context: CanvasRenderingContext2D
	private fieldSize = 40
	private gridThickness = 1
	private gridColor = "black"
	private outerBorder = 3
	private hexPath = new Path2D()
	private evenRowOffset = (this.gridThickness + this.fieldSize) / 2
	private hexDeltaX = 0
	private hexDeltaY = 0
	private translateX = 0
	private translateY = 0
	private lastMouseX = 0
	private lastMouseY = 0
	private mouseIsDown = false
	private isDragging = false

	ngOnInit() {
		this.setupHexagons()
		this.resetCanvas()
		this.drawEverything()
	}

	private resetCanvas() {
		this.sizeToWindow()
		this.context = this.canvas.getContext("2d")
	}

	private sizeToWindow() {
		// this.fieldSize = 4
		this.canvas.width = this.canvasElement.nativeElement.parentElement.clientWidth
		this.canvas.height = this.canvasElement.nativeElement.parentElement.clientHeight
	}

	private setupHexagons() {
		this.hexDeltaX = this.fieldSize + this.gridThickness
		this.hexDeltaY = 3 * (this.fieldSize / (2 * Math.sqrt(3))) + this.gridThickness / Math.sqrt(3)
		this.evenRowOffset = this.hexDeltaX / 2
		this.hexPath = this.createHexagonPath()
	}

	private createHexagonPath(): Path2D {
		const halfWidth = this.fieldSize / 2
		const fourthHeight = this.fieldSize / (2 * Math.sqrt(3))
		const path = new Path2D()
		path.moveTo(0, fourthHeight)
		path.lineTo(halfWidth, 0)
		path.lineTo(halfWidth * 2, fourthHeight)
		path.lineTo(halfWidth * 2, fourthHeight * 3)
		path.lineTo(halfWidth, fourthHeight * 4)
		path.lineTo(0, fourthHeight * 3)
		path.closePath()
		return path
	}

	private drawEverything() {
		this.drawBackground()
		for (const { x, y, field } of this.game.state.board.allFields())
			this.drawField(x, y, field)
	}

	private drawBackground() {
		this.context.fillStyle = this.gridColor
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
	}

	private drawField(x: number, y: number, field: any) {
		this.context.fillStyle = this.colorForField(field)
		this.drawHexagon(x, y)
	}

	private colorForField(field: Field) {
		switch (field.type) {
			case FieldType.Plains: return "orange"
			case FieldType.Forest: return "green"
			case FieldType.Marsh: return "darkgreen"
			case FieldType.Highlands: return "beige"
			case FieldType.Mountain: return "grey"
			case FieldType.Water: return "blue"
			default: return "purple"
		}
	}

	private drawHexagon(x: number, y: number) {
		this.context.save()
		const offset = y % 2 === 0 ? this.evenRowOffset : 0
		this.context.translate(
			x * this.hexDeltaX + this.translateX + this.gridThickness + offset,
			y * this.hexDeltaY + this.translateY)
		this.context.fill(this.hexPath)
		if (this.isSelected(x, y)) {
			this.context.lineWidth = 2.0
			this.context.strokeStyle = "white"
			this.context.stroke(this.hexPath)
		}
		this.context.restore()
	}

	private isSelected(x: number, y: number) {
		if (!this.displayState.selectedField)
			return false
		return this.displayState.selectedField.x === x && this.displayState.selectedField.y === y
	}

	mousedown(event: MouseEvent) {
		event.preventDefault()
		this.mouseIsDown = true
	}

	mouseup(event: MouseEvent) {
		event.preventDefault()
		this.mouseIsDown = false
		if (this.isDragging)
			return
		const { x, y } = this.gridPositionFromMousePosition(event)
		const field = this.game.state.board.get(x, y)
		this.clickField.emit({ x, y, field })
		console.log(x, y)
		this.drawEverything()
	}

	private gridPositionFromMousePosition(event: MouseEvent) {
		const rect = this.canvas.getBoundingClientRect()
		const canvasX = event.clientX - rect.left
		const canvasY = event.clientY - rect.top
		const gridX = Math.floor((canvasX - this.translateX) / this.hexDeltaX)
		const gridY = Math.floor((canvasY - this.translateY) / this.hexDeltaY)
		let nearestPosition = { x: gridX, y: gridY }
		let smallestDistance = this.distanceToHex(canvasX, canvasY, nearestPosition)
		for (const hex of hexesAdjacentTo(gridX, gridY)) {
			const distance = this.distanceToHex(canvasX, canvasY, hex)
			if (distance < smallestDistance) {
				smallestDistance = distance
				nearestPosition = hex
			}
		}
		return nearestPosition
	}

	private distanceToHex(canvasX: number, canvasY: number, hex: { x: number, y: number }) {
		const offset = hex.y % 2 === 0 ? this.evenRowOffset : 0
		const baseX = hex.x * this.hexDeltaX + this.hexDeltaX / 2 + offset
		const baseY = hex.y * this.hexDeltaY + this.hexDeltaY * 2 / 3
		const x = canvasX - this.translateX - baseX
		const y = canvasY - this.translateY - baseY
		return x * x + y * y
	}

	mousemove(event: MouseEvent) {
		event.preventDefault()
		this.isDragging = false
		if (!this.mouseIsDown)
			return this.updateLastMousePosition(event)
		this.isDragging = true
		this.translateX += event.clientX - this.lastMouseX
		this.translateY += event.clientY - this.lastMouseY
		this.updateLastMousePosition(event)
		this.drawEverything()
	}

	private updateLastMousePosition(event: MouseEvent) {
		this.lastMouseX = event.clientX
		this.lastMouseY = event.clientY
	}

	mouseleave() {
		this.mouseIsDown = false
		this.isDragging = false
	}

	mouseenter() {
		this.mouseIsDown = false
		this.isDragging = false
	}

	scroll(event: WheelEvent) {
		event.preventDefault()
		if (event.deltaY > 0)
			this.fieldSize -= 5
		else
			this.fieldSize += 5
		if (this.fieldSize < 10)
			this.fieldSize = 10
		this.setupHexagons()
		this.drawEverything()
	}
}

export interface FieldSelection { x: number, y: number, field: Field }
