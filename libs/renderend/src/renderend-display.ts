import { Id, typeOf } from "@lundin/age"
import { Renderend } from "./renderend"
import { WebGl2Display } from "@lundin/web-gl-display"
import { Vector2 } from "@lundin/utility"

export class RenderendDisplay {
	public canvas: HTMLCanvasElement
	private display: WebGl2Display
	private textElements: { [index: string]: HTMLDivElement } = {}

	private fractionOfTick = 0
	private displayEntities: DisplayEntity[] = []
	private size = new ScreenSizes(true, 16, 100, 100, 160, 160)
	private resizeObserver: ResizeObserver

	constructor(
		private config: DisplayConfig,
		private game: Renderend,
		private hostElement: HTMLElement,
	) {
		this.initialiseCanvas()
		this.setupDisplay()
	}

	private initialiseCanvas() {
		this.hostElement.style.position = "relative"
		this.canvas = document.createElement("canvas")
		this.canvas.style.position = "absolute"
		if (this.size.renderToVirtualSize) {
			this.canvas.style.width = "100%"
			this.canvas.style.imageRendering = "pixelated"
		}
		this.hostElement.appendChild(this.canvas)
		this.resizeObserver = new ResizeObserver(() => this.updateSize())
		this.resizeObserver.observe(this.hostElement)
	}

	private setupDisplay() {
		this.display = new WebGl2Display(this.canvas, this.size.virtualPixelsPerTile, this.size.virtualHeight, this.size.renderToVirtualSize)
		for (const [name, sprite] of Object.entries(this.config.sprites))
			this.display.addSprite(name, this.config.assetFolder + sprite.url, sprite.width, sprite.height, sprite.centerX, sprite.centerY)
		this.setupTextElements()
		this.game.deathLogic.listeners.push(this)
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
		element.style.left = (this.size.hostPixelsPerTile * (this.size.widthInTiles / 2 - 1.5)) + "px"
		element.style.top = (this.size.hostPixelsPerTile * 9) + "px"
		element.style.fontSize = (this.size.hostPixelsPerTile * 0.5) + "px"
		element.style.width = (this.size.hostPixelsPerTile * 3) + "px"
		element.style.lineHeight = (this.size.hostPixelsPerTile * 1) + "px"
	}

	private setupGameOverText() {
		const element = this.getTextElement("game-over")
		element.style.display = "none"
		element.style.backgroundColor = "rgba(0,0,0,0.5)"
		element.style.textAlign = "center"
		element.style.color = "white"
		element.style.left = (this.size.hostPixelsPerTile * (this.size.widthInTiles / 2 - 3)) + "px"
		element.style.top = (this.size.hostPixelsPerTile * 4) + "px"
		element.style.fontSize = (this.size.hostPixelsPerTile * 1) + "px"
		element.style.width = (this.size.hostPixelsPerTile * 6) + "px"
		element.style.lineHeight = (this.size.hostPixelsPerTile * 2) + "px"
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
		element.style.fontFamily = `'${this.config.font}', Courier, monospace`
		element.style.fontWeight = "bold"
		this.canvas.parentElement.appendChild(element)
		return element
	}

	onDeath(entity: Id) {
		const type = this.game.config.typeMap.typeFor(typeOf(entity))
		if (type !== "obstacle")
			return
		this.displayEntities.push({
			sprite: "obstacle-explosion",
			position: this.game.entities.position.get.of(entity),
			velocity: this.game.state.globals.isAlive ? this.game.entities.velocity.get.of(entity) : new Vector2(0, 0),
			endTick: this.game.state.globals.tick + 20,
			animationStart: this.game.state.globals.tick,
			lastUpdate: this.game.state.globals.tick,
		})
	}

	updateSize() {
		this.setSize(this.hostElement.clientWidth, this.hostElement.clientHeight)
	}

	setSize(width: number, height: number) {
		this.size.updateHostSize(width, height)
		this.canvas.width = this.size.canvasWidth
		this.canvas.height = this.size.canvasHeight
		this.setupDisplay()
	}

	show(fractionOfTick = 0) {
		if (this.display.isLoading())
			return
		this.fractionOfTick = fractionOfTick
		this.display.startFrame()
		this.drawBackground()
		for (const entity of this.game.entities)
			this.drawEntity(entity)
		for (const entity of this.displayEntities.values())
			this.drawDisplayEntity(entity)
		this.display.endFrame()
		this.writeText()
	}

	private drawBackground() {
		const backgroundWidthInTiles = 450 / this.size.virtualPixelsPerTile
		const offset = this.backgroundBasePosition() % backgroundWidthInTiles
		this.drawSprite("background", new Vector2(offset, 0))
		this.drawSprite("background", new Vector2(offset + backgroundWidthInTiles, 0))
		this.drawSprite("background", new Vector2(offset + backgroundWidthInTiles * 2, 0))
	}

	private backgroundBasePosition() {
		const speedFactor = 0.5
		return -this.game.state.globals.distanceTravelled * speedFactor
			- this.game.state.globals.speed * speedFactor * this.fractionOfTick
	}

	private drawEntity(entity: Id) {
		if (typeOf(entity) === this.game.config.constants.shipType)
			this.drawShip(entity)
		else
			this.drawGeneralEntity(entity)
	}

	private drawGeneralEntity(entity: Id) {
		const position = this.currentPositionOf(entity)
		const sprite = this.game.config.typeMap.typeFor(typeOf(entity))
		this.drawSprite(sprite, position)
	}

	private drawShip(entity: Id) {
		const position = this.currentPositionOf(entity)
		const shields = this.shieldSpriteFor(entity)
		if (shields)
			this.drawSprite(shields, position)
		this.drawSprite("ship", position)
	}

	private shieldSpriteFor(entity: Id) {
		switch (this.game.entities.health.get.of(entity)) {
			case 3: return "full-shield"
			case 2: return "half-shield"
		}
	}

	private currentPositionOf(entity: Id) {
		const position = this.game.entities.position.get.of(entity)
		const velocity = this.game.entities.velocity.get.of(entity)
		if (!velocity)
			return position
		return position.add(velocity.multiply(this.fractionOfTick))
	}

	private drawDisplayEntity(entity: DisplayEntity) {
		if (entity.lastUpdate !== this.game.state.globals.tick)
			entity.position = entity.position.add(entity.velocity)
		entity.lastUpdate = this.game.state.globals.tick
		if (this.game.state.globals.tick < entity.endTick)
			this.drawSprite(entity.sprite, entity.position, entity.animationStart)
		else
			this.displayEntities.remove(entity)
	}

	private drawSprite(sprite: string, position: Vector2, animationStart = 0) {
		const config = this.config.sprites[sprite]
		if (!config.frameInterval)
			return this.display.drawSprite(sprite, position.x, position.y, 0, 0)
		const width = config.framesX ?? 1
		const height = config.framesY ?? 1
		const numberOfFrames = width * height
		const tick = this.game.state.globals.tick - animationStart
		const frameIndex = Math.floor(tick / config.frameInterval) % numberOfFrames
		const frameX = frameIndex % width
		const frameY = Math.floor(frameIndex / width) % height
		this.display.drawSprite(sprite, position.x, position.y, frameX, frameY)
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

	onDestroy() {
		this.resizeObserver.disconnect()
	}
}

export interface DisplayConfig {
	font: string,
	assetFolder: string,
	sprites: {
		[index: string]: {
			url: string,
			width?: number,
			height?: number,
			centerX?: number,
			centerY?: number,
			framesX?: number,
			framesY?: number,
			frameInterval?: number,
		}
	}
}

interface DisplayEntity {
	sprite: string
	position: Vector2
	velocity: Vector2
	endTick: number
	animationStart: number
	lastUpdate: number
}

class ScreenSizes {
	constructor(
		public renderToVirtualSize: boolean,
		public virtualPixelsPerTile: number,
		public hostWidth: number,
		public hostHeight: number,
		public virtualWidth: number,
		public virtualHeight: number,
	) { }

	get hostPixelsPerTile() { return (this.hostHeight / this.virtualHeight) * this.virtualPixelsPerTile }
	get canvasWidth() { return this.renderToVirtualSize ? this.virtualWidth : this.hostWidth }
	get canvasHeight() { return this.renderToVirtualSize ? this.virtualHeight : this.hostHeight }
	get widthInTiles() { return this.virtualWidth / this.virtualPixelsPerTile }
	get heightInTiles() { return this.virtualHeight / this.virtualPixelsPerTile }

	updateHostSize(width: number, height: number) {
		this.hostWidth = width
		this.hostHeight = height
		this.virtualWidth = this.hostWidth * (this.virtualHeight / this.hostHeight)
	}
}