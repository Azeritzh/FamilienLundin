import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core"
import { Agentia, AgentiaPresets } from "@lundin/agentia"

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
	fieldSize = 20

	setupText = ""
	showSetupText = false
	updateText = ""
	showUpdateText = false
	agentSetupText = ""
	showAgentSetupText = false
	agentUpdateText = ""
	showAgentUpdateText = false

	ngOnInit() {
		this.startGame()
		this.timerId = window.setInterval(this.step, 500)
	}

	ngOnDestroy() {
		window.clearInterval(this.timerId)
	}

	restart() {
		this.game = new Agentia()
	}

	startGame() {
		//
		this.resetCanvas()
		this.drawEverything()
	}

	resetCanvas() {
		this.sizeToArea()
		this.context = this.canvas.getContext("2d")
		this.canvas.width = this.game.config.width * this.fieldSize
		this.canvas.height = this.game.config.height * this.fieldSize
		this.context.fillStyle = "black"
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
	}

	private sizeToArea() {
		const width = window.innerWidth / 2
		const height = window.innerHeight / 2
		const horisontalFields = Math.max(this.game.config.width, 5)
		const verticalFields = Math.max(this.game.config.height, 5)
		const horisontalFieldSize = Math.floor(width / horisontalFields)
		const verticalFieldSize = Math.floor(height / verticalFields)
		this.fieldSize = Math.min(horisontalFieldSize, verticalFieldSize)
		this.fieldSize = Math.max(this.fieldSize, 15)
	}

	drawEverything() {
		for (const { x, y, field } of this.game.state.world.allFields())
			this.drawField(x, y, field)
		for (const agent of this.game.state.agents)
			this.drawAgent(agent)
	}

	private drawField(x: number, y: number, field: any) {
		if (!this.game.state.world.isWithinBounds(x, y))
			return
		const color = field ? "black" : "white"
		this.drawBox(x, y, color)
	}

	private drawBox(x: number, y: number, color: string,) {
		this.context.fillStyle = color
		this.context.fillRect(this.fieldSize * x, this.fieldSize * y, this.fieldSize, this.fieldSize)
	}

	private drawAgent(agent: any) {
		const bla = agent
		agent = bla
		// TODO
	}

	private step = () => {
		this.game.update()
		this.drawEverything()
	}

	updateWidth(width: number) {
		this.game.resize(width, this.game.config.height)
	}

	updateHeight(height: number) {
		this.game.resize(this.game.config.width, height)
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
}
