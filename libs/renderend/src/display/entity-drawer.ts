import { Id, typeOf } from "@lundin/age"
import { Renderend } from "../renderend"
import { SpriteDrawer } from "./sprite-drawer"

export class EntityDrawer {
	constructor(
		private game: Renderend,
		private spriteDrawer: SpriteDrawer,
	) { }

	drawEntities() {
		for (const entity of this.game.entities)
			this.drawEntity(entity)
	}

	private drawEntity(entity: Id) {
		if (typeOf(entity) === this.game.config.constants.shipType)
			this.drawShip(entity)
		else
			this.drawGeneralEntity(entity)
	}

	private drawGeneralEntity(entity: Id) {
		const position = this.game.entities.position.get.of(entity)
		const velocity = this.game.entities.velocity.get.of(entity)
		const sprite = this.game.config.typeMap.typeFor(typeOf(entity))
		this.spriteDrawer.drawSprite(sprite, position, velocity)
	}

	private drawShip(entity: Id) {
		const position = this.game.entities.position.get.of(entity)
		const velocity = this.game.entities.velocity.get.of(entity)
		const shields = this.shieldSpriteFor(entity)
		if (shields)
			this.spriteDrawer.drawSprite(shields, position, velocity)
		this.spriteDrawer.drawSprite("ship", position, velocity)
	}

	private shieldSpriteFor(entity: Id) {
		switch (this.game.entities.health.get.of(entity)) {
			case 3: return "full-shield"
			case 2: return "half-shield"
		}
	}
}
