import { Id, EntityTypeOf } from "@lundin/age"
import { Meld } from "../meld"
import { Camera, Layer } from "./camera"

export class EntityDrawer {
	constructor(
		private game: Meld,
		private camera: Camera,
	) { }

	draw(entity: Id) {
		if (EntityTypeOf(entity) === this.game.config.constants.playerType)
			this.drawPlayer(entity)
		else
			this.drawGeneralEntity(entity)
	}

	private drawGeneralEntity(entity: Id) {
		const position = this.game.entities.position.get.of(entity)
		const velocity = this.game.entities.velocity.get.of(entity)
		const sprite = this.game.config.entityTypeMap.TypeFor(EntityTypeOf(entity))
		this.camera.drawAnimated(sprite, Layer.Middle, position, velocity)
	}

	private drawPlayer(entity: Id) {
		const position = this.game.entities.position.get.of(entity)
		const velocity = this.game.entities.velocity.get.of(entity)
		const sprite = this.game.config.entityTypeMap.TypeFor(EntityTypeOf(entity))
		this.camera.drawAnimated(sprite, Layer.Middle, position, velocity)
	}
}
