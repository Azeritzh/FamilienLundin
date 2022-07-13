import { Id, EntityTypeOf } from "@lundin/age"
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
	}

	private updateDisplayEntities() {
		while (this.updatedToTick < this.game.state.globals.tick) {
			this.updatedToTick++
			for (const entity of this.state.displayEntities.values())
				this.updateDisplayEntity(entity)
		}
	}

	private updateDisplayEntity(entity: DisplayEntity) {
		entity.velocity.x = -this.game.state.globals.speed
		entity.position = entity.position.add(entity.velocity)
		if (entity.endTick <= this.game.state.globals.tick)
			this.state.displayEntities.remove(entity)
	}

	private drawDisplayEntity(entity: DisplayEntity) {
		this.spriteDrawer.draw(entity.sprite, entity.position, entity.velocity, entity.animationStart)
	}

	onDeath(entity: Id) {
		const type = this.game.config.typeMap.TypeFor(EntityTypeOf(entity))
		const deathSprite = this.config.DeathAnimations[type]
		if (!deathSprite)
			return
		const info = this.config.Sprites[deathSprite]
		this.state.displayEntities.push({
			sprite: deathSprite,
			position: this.game.entities.position.Get.Of(entity),
			velocity: new Vector2(0, 0),
			endTick: this.game.state.globals.tick + info.frameInterval * info.framesX * info.framesY,
			animationStart: this.game.state.globals.tick,
		})
	}
}
