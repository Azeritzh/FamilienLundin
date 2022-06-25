import { Id, typeOf } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { DisplayConfig } from "./display/display-config"
import { DisplayEntityDrawer } from "./display/display-entity-drawer"
import { DisplayState } from "./display/display-state"
import { EntityDrawer } from "./display/entity-drawer"
import { SpriteDrawer } from "./display/sprite-drawer"
import { Renderend } from "./renderend"
import { DisplayProvider } from "./renderend-game"

export class RenderendDisplay {
	constructor(
		private config: DisplayConfig,
		private game: Renderend,
		private display: DisplayProvider,
		private state = DisplayState.from(config),
		private spriteDrawer = new SpriteDrawer(game, display, config, state),
		private entityDrawer = new EntityDrawer(game, spriteDrawer),
		private displayEntityDrawer = new DisplayEntityDrawer(game, state, spriteDrawer),
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
		this.displayEntityDrawer.drawDisplayEntities()
		this.writeText()
		this.display.endFrame()
	}

	private drawBackground() {
		const backgroundWidthInTiles = 450 / this.state.size.virtualPixelsPerTile
		const offset = this.backgroundBasePosition() % backgroundWidthInTiles
		this.spriteDrawer.drawSprite("background", new Vector2(offset, 0))
		this.spriteDrawer.drawSprite("background", new Vector2(offset + backgroundWidthInTiles, 0))
		this.spriteDrawer.drawSprite("background", new Vector2(offset + backgroundWidthInTiles * 2, 0))
	}

	private backgroundBasePosition() {
		const speedFactor = 0.5
		return -this.game.state.globals.distanceTravelled * speedFactor
			- this.game.state.globals.speed * speedFactor * this.state.fractionOfTick
	}

	private writeText() {
		const distance = "" + Math.floor(this.game.state.globals.distanceTravelled)
		this.display.drawString(distance, this.state.size.widthInTiles / 2, 9, this.config.font, 0.5)
		if (!this.game.state.globals.isAlive)
			this.display.drawString("GAME OVER", this.state.size.widthInTiles / 2, 4, this.config.font, 1)
	}
}
