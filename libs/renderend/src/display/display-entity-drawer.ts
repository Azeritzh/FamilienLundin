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
		if (entity.lastUpdate !== this.game.state.globals.tick)
			entity.position = entity.position.add(entity.velocity)
		entity.lastUpdate = this.game.state.globals.tick
		if (this.game.state.globals.tick < entity.endTick)
			this.spriteDrawer.drawSprite(entity.sprite, entity.position, null, entity.animationStart)
		else
			this.state.displayEntities.remove(entity)
	}
}
