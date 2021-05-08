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
	private fieldSize = 4

	ngOnInit() {
		this.resetCanvas()
		this.drawEverything()
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
		for (const { x, y, field } of this.game.state.board.allFields())
			this.drawField(x, y, field)
	}

	private drawField(x: number, y: number, field: any) {
		this.context.fillStyle = this.colorForField(field)
		this.context.fillRect(this.fieldSize * x, this.fieldSize * y, this.fieldSize, this.fieldSize)
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

	sizeToWindow() {
		const availableWidth = this.canvasElement.nativeElement.parentElement.clientWidth
		const availableHeight = this.canvasElement.nativeElement.parentElement.clientHeight
		this.game.config.width = Math.floor(availableWidth / 4)
		this.game.config.height = Math.floor(availableHeight / 4)
		this.fieldSize = 4
		this.updateCanvasSize()
	}

	private updateCanvasSize() {
		this.canvas.width = this.game.config.width * this.fieldSize
		this.canvas.height = this.game.config.height * this.fieldSize
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
}
