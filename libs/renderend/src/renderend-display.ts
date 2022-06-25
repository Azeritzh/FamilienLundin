import { Id, typeOf } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { DisplayConfig } from "./display/display-config"
import { DisplayEntity, DisplayState } from "./display/display-state"
import { EntityDrawer } from "./display/entity-drawer"
import { Renderend } from "./renderend"
import { DisplayProvider } from "./renderend-game"

export class RenderendDisplay {
	constructor(
		private config: DisplayConfig,
		private game: Renderend,
		private display: DisplayProvider,
		private state = DisplayState.from(config),
		private entityDrawer = new EntityDrawer(game, display, config, state),
	) {
		this.game.deathLogic.listeners.push(this)
	}

	onDeath(entity: Id) {
		const type = this.game.config.typeMap.typeFor(typeOf(entity))
		if (type !== "obstacle")
			return
		this.state.displayEntities.push({
			sprite: "obstacle-explosion",
			position: this.game.entities.position.get.of(entity),
			velocity: this.game.state.globals.isAlive ? this.game.entities.velocity.get.of(entity) : new Vector2(0, 0),
			endTick: this.game.state.globals.tick + 40,
			animationStart: this.game.state.globals.tick,
			lastUpdate: this.game.state.globals.tick,
		})
	}

	setSize(width: number, height: number) {
		this.state.size.updateHostSize(width, height)
	}

	show(fractionOfTick = 0) {
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
		const distance = "" + Math.floor(this.game.state.globals.distanceTravelled)
		this.display.drawString(distance, this.state.size.widthInTiles / 2, 9, this.config.font, 0.5)
		if (!this.game.state.globals.isAlive)
			this.display.drawString("GAME OVER", this.state.size.widthInTiles / 2, 4, this.config.font, 1)
	}
}
