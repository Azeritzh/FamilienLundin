import { Id, typeOf } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { WebGl2Display } from "@lundin/web-gl-display"
import { DisplayEntity, DisplayState } from "./display/display-state"
import { EntityDrawer } from "./display/entity-drawer"
import { Renderend } from "./renderend"

export class RenderendDisplay {
	public canvas: HTMLCanvasElement
	private display: WebGl2Display
	private resizeObserver: ResizeObserver

	constructor(
		private config: DisplayConfig,
		private game: Renderend,
		private hostElement: HTMLElement,
		private state = new DisplayState(),
		private entityDrawer = new EntityDrawer(game, null, config, state),
	) {
		this.initialiseCanvas()
		this.setupDisplay()
		entityDrawer.displayProvider = this.display // TODO
	}

	private initialiseCanvas() {
		this.hostElement.style.position = "relative"
		this.canvas = document.createElement("canvas")
		this.canvas.style.position = "absolute"
		if (this.state.size.renderToVirtualSize) {
			this.canvas.style.width = "100%"
			this.canvas.style.imageRendering = "pixelated"
		}
		this.hostElement.appendChild(this.canvas)
		this.resizeObserver = new ResizeObserver(() => this.updateSize())
		this.resizeObserver.observe(this.hostElement)
	}

	private setupDisplay() {
		this.display = new WebGl2Display(
			this.canvas,
			this.state.size.virtualPixelsPerTile,
			this.state.size.virtualHeight,
			this.state.size.renderToVirtualSize,
		)
		this.entityDrawer.displayProvider = this.display // TODO
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
		element.style.left = (this.state.size.hostPixelsPerTile * (this.state.size.widthInTiles / 2 - 1.5)) + "px"
		element.style.top = (this.state.size.hostPixelsPerTile * 9) + "px"
		element.style.fontSize = (this.state.size.hostPixelsPerTile * 0.5) + "px"
		element.style.width = (this.state.size.hostPixelsPerTile * 3) + "px"
		element.style.lineHeight = (this.state.size.hostPixelsPerTile * 1) + "px"
	}

	private setupGameOverText() {
		const element = this.getTextElement("game-over")
		element.style.display = "none"
		element.style.backgroundColor = "rgba(0,0,0,0.5)"
		element.style.textAlign = "center"
		element.style.color = "white"
		element.style.left = (this.state.size.hostPixelsPerTile * (this.state.size.widthInTiles / 2 - 3)) + "px"
		element.style.top = (this.state.size.hostPixelsPerTile * 4) + "px"
		element.style.fontSize = (this.state.size.hostPixelsPerTile * 1) + "px"
		element.style.width = (this.state.size.hostPixelsPerTile * 6) + "px"
		element.style.lineHeight = (this.state.size.hostPixelsPerTile * 2) + "px"
		element.innerText = "GAME OVER"
	}

	private getTextElement(key: string) {
		if (!this.state.textElements[key])
			this.state.textElements[key] = this.createTextElement()
		return this.state.textElements[key]
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
		this.state.displayEntities.push({
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
		this.state.size.updateHostSize(width, height)
		this.canvas.width = this.state.size.canvasWidth
		this.canvas.height = this.state.size.canvasHeight
		this.setupDisplay()
	}

	show(fractionOfTick = 0) {
		if (this.display.isLoading())
			return
		this.state.fractionOfTick = fractionOfTick
		this.display.startFrame()
		this.drawBackground()
		this.entityDrawer.drawEntities()
		for (const entity of this.state.displayEntities.values())
			this.drawDisplayEntity(entity)
		this.display.endFrame()
		this.writeText()
	}

	private drawBackground() {
		const backgroundWidthInTiles = 450 / this.state.size.virtualPixelsPerTile
		const offset = this.backgroundBasePosition() % backgroundWidthInTiles
		this.drawSprite("background", new Vector2(offset, 0))
		this.drawSprite("background", new Vector2(offset + backgroundWidthInTiles, 0))
		this.drawSprite("background", new Vector2(offset + backgroundWidthInTiles * 2, 0))
	}

	private backgroundBasePosition() {
		const speedFactor = 0.5
		return -this.game.state.globals.distanceTravelled * speedFactor
			- this.game.state.globals.speed * speedFactor * this.state.fractionOfTick
	}

	private drawDisplayEntity(entity: DisplayEntity) {
		if (entity.lastUpdate !== this.game.state.globals.tick)
			entity.position = entity.position.add(entity.velocity)
		entity.lastUpdate = this.game.state.globals.tick
		if (this.game.state.globals.tick < entity.endTick)
			this.drawSprite(entity.sprite, entity.position, entity.animationStart)
		else
			this.state.displayEntities.remove(entity)
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
