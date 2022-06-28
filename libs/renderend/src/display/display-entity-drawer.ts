import { Id, typeOf } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { Renderend } from "../renderend"
import { DisplayConfig } from "./display-config"
import { DisplayEntity, DisplayState } from "./display-state"
import { SpriteDrawer } from "./sprite-drawer"

export class DisplayEntityDrawer {
	constructor(
		private game: Renderend,
		private config: DisplayConfig,
		private state: DisplayState,
		private spriteDrawer: SpriteDrawer,
		private updatedToTick = game.state.globals.tick
	) { }

	drawDisplayEntities() {
		this.updateDisplayEntities()
		for (const entity of this.state.displayEntities.values())
			this.drawDisplayEntity(entity)
		this.updatedToTick = this.game.state.globals.tick
	}

	private updateDisplayEntities() {
		while(this.updatedToTick < this.game.state.globals.tick){
			this.updatedToTick++
			for (const entity of this.state.displayEntities.values())
				this.updateDisplayEntity(entity)
		}
	}

	private updateDisplayEntity(entity: DisplayEntity) {
		if (!entity.velocity)
			entity.velocity = new Vector2(0, 0)
		entity.velocity.x = -this.game.state.globals.speed
		entity.position = entity.position.add(entity.velocity)
	}

	private drawDisplayEntity(entity: DisplayEntity) {
		if (this.game.state.globals.tick < entity.endTick)
			this.spriteDrawer.draw(entity.sprite, entity.position, entity.velocity, entity.animationStart)
		else
			this.state.displayEntities.remove(entity)
	}

	onDeath(entity: Id) {
		const type = this.game.config.typeMap.typeFor(typeOf(entity))
		const deathSprite = this.config.deathAnimations[type]
		if (!deathSprite)
			return
		const info = this.config.sprites[deathSprite]
		this.spawnExplosion(
			deathSprite,
			this.game.entities.position.get.of(entity),
			info.frameInterval * info.framesX * info.framesY,
		)
	}

	private spawnExplosion(sprite: string, position: Vector2, timeToLive: number) {
		this.state.displayEntities.push({
			sprite,
			position,
			velocity: null,
			endTick: this.game.state.globals.tick + timeToLive,
			animationStart: this.game.state.globals.tick,
			lastUpdate: this.game.state.globals.tick,
		})
	}
}
