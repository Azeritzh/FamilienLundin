import { Id, typeOf } from "@lundin/age"
import { Renderend } from "@lundin/renderend"
import { WebGl2Display } from "@lundin/web-gl-display"

export class RenderendDisplay {
	private display: WebGl2Display
	private textElements: { [index: string]: HTMLDivElement } = {}
	private readonly gameHeightInTiles = 10
	private get gameWidthInTiles() { return this.canvas.width / this.screenPixelsPerTile }
	private readonly gamePixelsPerTile = 16
	private screenPixelsPerTile = 100
	private backgroundWidthInTiles = 220 / this.gamePixelsPerTile
	private fractionOfTick = 0

	constructor(
		private game: Renderend,
		private canvas: HTMLCanvasElement,
	) {
		this.setupDisplay()
	}

	private setupDisplay() {
		this.display = new WebGl2Display(this.canvas, this.gamePixelsPerTile, this.gameHeightInTiles * this.gamePixelsPerTile)
		this.display.addSprite("ship", "assets/images/renderend/ship.png", 16, 16)
		this.display.addSprite("wall", "assets/images/renderend/wall.png", 16, 16)
		this.display.addSprite("obstacle", "assets/images/renderend/obstacle.png", 16, 16)
		this.display.addSprite("big-obstacle", "assets/images/renderend/big-obstacle.png", 32, 32)
		this.display.addSprite("background", "assets/images/renderend/starry-background.png", 220, 160, 0, 0)
		this.setupTextElements()
	}

	private setupTextElements() {
		this.setupDistanceText()
		this.setupGameOverText()
	}

	private setupDistanceText() {
		const element = this.getTextElement("distance")
		element.style.backgroundColor = "rgba(0,0,0,0.5)"
		element.style.textAlign = "center"
		element.style.color = "white"
		element.style.left = this.screenPixelsFromTiles(this.gameWidthInTiles / 2 - 1.5) + "px"
		element.style.top = this.screenPixelsFromTiles(9) + "px"
		element.style.fontSize = this.screenPixelsFromTiles(0.5) + "px"
		element.style.width = this.screenPixelsFromTiles(3) + "px"
		element.style.lineHeight = this.screenPixelsFromTiles(1) + "px"
	}

	private setupGameOverText() {
		const element = this.getTextElement("game-over")
		element.style.display = "none"
		element.style.backgroundColor = "rgba(0,0,0,0.5)"
		element.style.textAlign = "center"
		element.style.color = "white"
		element.style.left = this.screenPixelsFromTiles(this.gameWidthInTiles / 2 - 3) + "px"
		element.style.top = this.screenPixelsFromTiles(4) + "px"
		element.style.fontSize = this.screenPixelsFromTiles(1) + "px"
		element.style.width = this.screenPixelsFromTiles(6) + "px"
		element.style.lineHeight = this.screenPixelsFromTiles(2) + "px"
		element.innerText = "GAME OVER"
	}

	private getTextElement(key: string) {
		if (!this.textElements[key])
			this.textElements[key] = this.createTextElement()
		return this.textElements[key]
	}

	private createTextElement() {
		const element = document.createElement("div")
		element.style.position = "absolute"
		element.style.fontFamily = "'Vt323', Courier, monospace"
		element.style.fontWeight = "bold"
		this.canvas.parentElement.appendChild(element)
		return element
	}

	private screenPixelsFromTiles(tiles: number) {
		return this.screenPixelsPerTile * tiles
	}

	setSize(width: number, height: number) {
		this.canvas.width = width
		this.canvas.height = height
		this.screenPixelsPerTile = height / this.gameHeightInTiles
		this.setupDisplay()
	}

	show(fractionOfTick = 0) {
		this.fractionOfTick = fractionOfTick
		this.display.startFrame()
		this.drawBackground()
		for (const entity of this.game.entities)
			this.drawEntity(entity)
		this.display.endFrame()
		this.writeText()
	}

	private drawBackground() {
		const offset = this.backgroundBasePosition() % this.backgroundWidthInTiles
		this.display.drawSprite("background", offset, 0, 0, 0)
		this.display.drawSprite("background", offset + this.backgroundWidthInTiles, 0, 0, 0)
		this.display.drawSprite("background", offset + this.backgroundWidthInTiles * 2, 0, 0, 0)
	}

	private backgroundBasePosition() {
		const speedFactor = 0.5
		return -this.game.state.globals.distanceTravelled * speedFactor
			- this.game.state.globals.speed * speedFactor * this.fractionOfTick
	}

	private drawEntity(entity: Id) {
		const pos = this.currentPositionOf(entity)
		const sprite = this.game.config.typeMap.typeFor(typeOf(entity))
		this.display.drawSprite(sprite, pos.x, pos.y, 0, 0)
	}

	private currentPositionOf(entity: Id) {
		const position = this.game.access.position.of(entity)
		const velocity = this.game.access.velocity.of(entity)
		if (!velocity)
			return position
		return position.add(velocity.multiply(this.fractionOfTick))
	}

	private writeText() {
		this.showGameOver()
		const distance = this.getTextElement("distance")
		distance.innerText = "" + Math.floor(this.game.state.globals.distanceTravelled)
	}

	private showGameOver() {
		const gameOver = this.getTextElement("game-over")
		gameOver.style.display = this.game.state.globals.isAlive ? "none" : "block"
	}
}
