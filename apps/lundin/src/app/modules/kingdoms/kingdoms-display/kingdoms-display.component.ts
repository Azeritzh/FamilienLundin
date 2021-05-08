import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core"
import { Kingdoms, Field, FieldType } from "@lundin/kingdoms"

@Component({
	selector: "lundin-kingdoms-display",
	templateUrl: "./kingdoms-display.component.html",
})
export class KingdomsDisplayComponent implements OnInit {
	@Input() game = new Kingdoms()
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
	private hexPathOffset = new Path2D()
	private hexDeltaX = 0
	private hexDeltaY = 0
	private translateX = 0
	private translateY = 0

	ngOnInit() {
		this.setupHexagons()
		this.resetCanvas()
		this.drawEverything()
	}

	private resetCanvas() {
		this.sizeToWindow()
		this.context = this.canvas.getContext("2d")
	}

	private drawEverything() {
		this.drawBackground()
		for (const { x, y, field } of this.game.state.board.allFields())
			this.drawField(x, y, field)
	}

	private drawBackground() {
		const offset = (this.gridThickness + this.fieldSize) / 2
		const extraY = this.fieldSize / (2 * Math.sqrt(3))

		const left = this.translateX + this.gridThickness - this.outerBorder
		const top = this.translateY + this.gridThickness - this.outerBorder
		const width = this.game.config.width * this.hexDeltaX - this.gridThickness + this.outerBorder * 2 + offset
		const height = this.game.config.height * this.hexDeltaY - this.gridThickness + this.outerBorder * 2 + extraY

		this.context.fillStyle = this.gridColor
		this.context.fillRect(left, top, width, height)
	}

	private drawField(x: number, y: number, field: any) {
		this.context.fillStyle = this.colorForField(field)
		this.drawHexagon(x, y)
	}

	private colorForField(field: Field) {
		switch (field.type) {
			case FieldType.Plains: return "yellow"
			case FieldType.Forest: return "green"
			case FieldType.Marsh: return "darkgreen"
			case FieldType.Highlands: return "beige"
			case FieldType.Mountain: return "grey"
			case FieldType.Water: return "blue"
			default: return "purple"
		}
	}

	private setupHexagons() {
		this.hexDeltaX = this.fieldSize + this.gridThickness
		this.hexDeltaY = 3 * (this.fieldSize / (2 * Math.sqrt(3.0))) + this.gridThickness / Math.sqrt(3.0)
		this.hexPath = this.createHexagonPath(false)
		this.hexPathOffset = this.createHexagonPath(true)
	}

	private createHexagonPath(offset: boolean): Path2D {
		const halfWidth = this.fieldSize / 2
		const fourthHeight = this.fieldSize / (2 * Math.sqrt(3))
		const offsetWidth = offset ? 0 : (halfWidth + this.gridThickness / 2)
		const path = new Path2D()
		path.moveTo(0.0 + offsetWidth, fourthHeight)
		path.lineTo(halfWidth + offsetWidth, 0)
		path.lineTo(halfWidth * 2 + offsetWidth, fourthHeight)
		path.lineTo(halfWidth * 2 + offsetWidth, fourthHeight * 3)
		path.lineTo(halfWidth + offsetWidth, fourthHeight * 4)
		path.lineTo(0.0 + offsetWidth, fourthHeight * 3)
		path.closePath()
		return path
	}

	sizeToWindow() {
		// this.fieldSize = 4
		this.canvas.width = this.canvasElement.nativeElement.parentElement.clientWidth
		this.canvas.height = this.canvasElement.nativeElement.parentElement.clientHeight
	}

	clickCanvas(event: MouseEvent) {
		event.preventDefault()
		const { x, y } = this.gridPositionFromMousePosition(event)
		console.log(x, y)
		// TODO: do something
		this.drawEverything()
	}

	private gridPositionFromMousePosition(event: MouseEvent) {
		const rect = this.canvas.getBoundingClientRect()
		const mx = event.clientX - rect.left
		const my = event.clientY - rect.top
		const x = mx / this.fieldSize
		const y = my / this.fieldSize
		return { x: x, y: y }
	}

	private drawHexagon(x: number, y: number) {
		this.context.save()
		this.context.translate(x * this.hexDeltaX + this.translateX + this.gridThickness, y * this.hexDeltaY + this.translateY)
		this.context.fill(y % 2 === 0 ? this.hexPath : this.hexPathOffset)
		this.context.restore()
	}
}
