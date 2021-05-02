import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core"
import { Agentia, AgentiaPresets, Agent } from "@lundin/agentia"
import { Vector2 } from "@lundin/utility"

@Component({
	selector: "lundin-agentia",
	templateUrl: "./agentia.component.html",
	styleUrls: ["./agentia.component.scss"],
})
export class AgentiaComponent implements OnInit, OnDestroy {
	game = new Agentia()
	@ViewChild("canvas", { static: true }) canvasElement: ElementRef<HTMLCanvasElement>
	get canvas() {
		return this.canvasElement.nativeElement
	}
	private context: CanvasRenderingContext2D
	private timerId: number
	private fieldSize = 4

	showAdvancedSettings = false
	setupText = ""
	updateText = ""
	agentSetupText = ""
	agentUpdateText = ""

	constructor(
		private ngZone: NgZone
	) { }

	ngOnInit() {
		this.resetCanvas()
		this.game.setup()
		this.drawEverything()
		this.ngZone.runOutsideAngular(() =>
			this.timerId = window.setInterval(this.step, 100)
		)
	}

	ngOnDestroy() {
		window.clearInterval(this.timerId)
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
		for (const { x, y, field } of this.game.state.world.allFields())
			this.drawField(x, y, field)
		for (const agent of this.game.state.agents)
			this.drawAgent(agent)
	}

	private drawField(x: number, y: number, field: any) {
		if (!field)
			return
		this.context.fillStyle = field ? "black" : "white"
		this.context.fillRect(this.fieldSize * x, this.fieldSize * y, this.fieldSize, this.fieldSize)
	}

	private drawAgent(agent: Agent) {
		const forwardVector = Vector2.fromAngle(agent.orientation).multiply(2)
		const forwardPoint = forwardVector.multiply(2).add(agent.position)
		const leftPoint = forwardVector.rotate(2).add(agent.position)
		const rightPoint = forwardVector.rotate(-2).add(agent.position)

		this.context.strokeStyle = "black"
		this.context.beginPath()
		this.context.moveTo(forwardPoint.x * this.fieldSize, forwardPoint.y * this.fieldSize)
		this.context.lineTo(leftPoint.x * this.fieldSize, leftPoint.y * this.fieldSize)
		this.context.lineTo(rightPoint.x * this.fieldSize, rightPoint.y * this.fieldSize)
		this.context.lineTo(forwardPoint.x * this.fieldSize, forwardPoint.y * this.fieldSize)
		this.context.closePath()
		this.context.stroke()
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

	private step = () => {
		this.game.update()
		this.drawEverything()
	}

	updateWidth(width: number) {
		this.game.resize(width, this.game.config.height)
		this.updateFieldSize()
	}

	updateHeight(height: number) {
		this.game.resize(this.game.config.width, height)
		this.updateFieldSize()
	}

	private updateFieldSize() {
		const availableWidth = this.canvasElement.nativeElement.parentElement.clientWidth
		const availableHeight = this.canvasElement.nativeElement.parentElement.clientHeight
		const horisontalFieldSize = Math.floor(availableWidth / this.game.config.width)
		const verticalFieldSize = Math.floor(availableHeight / this.game.config.height)
		this.fieldSize = Math.max(Math.min(horisontalFieldSize, verticalFieldSize), 4)
		this.updateCanvasSize()
	}

	updateCode() {
		this.game.updateConfig(this.setupText, this.updateText, this.agentSetupText, this.agentUpdateText)
		this.game.setup()
	}

	useGameOfLifePreset() {
		const preset = AgentiaPresets.GameOfLife
		this.setupText = preset.setup
		this.updateText = preset.update
		this.agentSetupText = ""
		this.agentUpdateText = ""
		this.updateCode()
	}

	useBoidsPreset() {
		const preset = AgentiaPresets.Boids
		this.setupText = preset.setup
		this.updateText = ""
		this.agentSetupText = preset.agentSetup
		this.agentUpdateText = preset.agentUpdate
		this.updateCode()
	}
}
