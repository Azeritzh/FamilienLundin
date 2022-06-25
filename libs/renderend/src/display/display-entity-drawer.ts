import { Id, typeOf } from "@lundin/age"
import { Renderend } from "../renderend"
import { DisplayEntity, DisplayState } from "./display-state"
import { SpriteDrawer } from "./sprite-drawer"

export class DisplayEntityDrawer {
	constructor(
		private game: Renderend,
		private state: DisplayState,
		private spriteDrawer: SpriteDrawer,
	) { }

	drawDisplayEntities() {
		for (const entity of this.state.displayEntities.values())
			this.drawDisplayEntity(entity)
	}

	private drawDisplayEntity(entity: DisplayEntity) {
		if (entity.lastUpdate !== this.game.state.globals.tick && entity.velocity)
			entity.position = entity.position.add(entity.velocity)
		entity.lastUpdate = this.game.state.globals.tick
		if (this.game.state.globals.tick < entity.endTick)
			this.spriteDrawer.draw(entity.sprite, entity.position, null, entity.animationStart)
		else
			this.state.displayEntities.remove(entity)
	}

	onDeath(entity: Id) {
		const type = this.game.config.typeMap.typeFor(typeOf(entity))
		if (type !== "obstacle")
			return
		this.state.displayEntities.push({
			sprite: "obstacle-explosion",
			position: this.game.entities.position.get.of(entity),
			velocity: this.game.state.globals.isAlive ? this.game.entities.velocity.get.of(entity) : null,
			endTick: this.game.state.globals.tick + 40,
			animationStart: this.game.state.globals.tick,
			lastUpdate: this.game.state.globals.tick,
		})
	}
}
