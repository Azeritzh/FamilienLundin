import { Id, typeOf } from "@lundin/age"
import { Renderend } from "@lundin/renderend"
import { WebGl2Display } from "@lundin/web-gl-display"

export class RenderendDisplay {
	private display: WebGl2Display
	private textElements: { [index: string]: HTMLDivElement } = {}
	private stop = false
	private readonly gameHeightInTiles = 10
	private get gameWidthInTiles() { return this.canvas.width / this.screenPixelsPerTile }
	private readonly gamePixelsPerTile = 16
	private screenPixelsPerTile = 100

	constructor(
		private game: Renderend,
		private canvas: HTMLCanvasElement,
	) {
		this.setupDisplay()
	}

	onDestroy() {
		this.stop = true
	}

	startDisplayLoop() {
		requestAnimationFrame(this.drawEverything)
	}

	private setupDisplay() {
		this.display = new WebGl2Display(this.canvas, this.gamePixelsPerTile, this.gameHeightInTiles * this.gamePixelsPerTile)
		this.display.addSprite("ship", "assets/images/renderend/ship.png", 16, 16)
		this.display.addSprite("wall", "assets/images/renderend/wall.png", 16, 16)
		this.display.addSprite("obstacle", "assets/images/renderend/obstacle.png", 16, 16)
		this.display.addSprite("background", "assets/images/renderend/starry-background.png", 220, 160)
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

	private screenPixelsFromTiles(tiles: number) {
		return this.screenPixelsPerTile * tiles
	}

	setSize(width: number, height: number) {
		this.canvas.width = width
		this.canvas.height = height
		this.screenPixelsPerTile = height / this.gameHeightInTiles
		this.setupDisplay()
	}

	private drawEverything = () => {
		this.display.startFrame()
		this.drawBackground()
		for (const entity of this.game.entities)
			this.drawEntity(entity)
		this.display.endFrame()
		this.writeText()
		if (!this.stop)
			requestAnimationFrame(this.drawEverything)
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
		const sprite = this.game.config.typeMap.typeFor(typeOf(entity))
		// These are how the sprite should be offset in comparison to the entity's center point
		// It's just hardcoded for now, so sprites of size 1x1 will center on the entity's center point
		const offsetX = -0.5
		const offsetY = -0.5
		this.display.drawSprite(sprite, pos.x + offsetX, pos.y + offsetY, 0, 0)
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
}
