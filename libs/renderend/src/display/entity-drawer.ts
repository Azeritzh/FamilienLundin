import { Id, EntityTypeOf } from "@lundin/age"
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
		if (EntityTypeOf(entity) === this.game.config.constants.shipType)
			this.drawShip(entity)
		else
			this.drawGeneralEntity(entity)
	}

	private drawGeneralEntity(entity: Id) {
		const position = this.game.entities.position.Get.Of(entity)!
		const velocity = this.game.entities.velocity.Get.Of(entity)
		const sprite = this.game.config.typeMap.TypeFor(EntityTypeOf(entity))
		this.spriteDrawer.draw(sprite ?? "ERROR", position, velocity)
	}

	private drawShip(entity: Id) {
		const position = this.game.entities.position.Get.Of(entity)!
		const velocity = this.game.entities.velocity.Get.Of(entity)
		const shields = this.shieldSpriteFor(entity)
		if (shields)
			this.spriteDrawer.draw(shields, position, velocity)
		this.spriteDrawer.draw("ship", position, velocity)
		const charge = this.chargeSpriteFor(entity)
		if (charge)
			this.spriteDrawer.draw(charge, position, velocity)
	}

	private shieldSpriteFor(entity: Id) {
		switch (this.game.entities.health.Get.Of(entity)) {
			case 3: return "full-shield"
			case 2: return "half-shield"
		}
		return null
	}

	private chargeSpriteFor(entity: Id) {
		const charge = this.game.entities.charge.Get.Of(entity) ?? 0
		if (4 <= charge)
			return "charge-4"
		if (3 <= charge)
			return "charge-3"
		if (2 <= charge)
			return "charge-2"
		if (1 <= charge)
			return "charge-1"
		return null
	}
}
