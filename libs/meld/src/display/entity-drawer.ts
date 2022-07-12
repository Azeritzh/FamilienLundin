import { Id, EntityTypeOf } from "@lundin/age"
import { Meld } from "../meld"
import { Camera, Layer } from "./camera"

export class EntityDrawer {
	constructor(
		private Game: Meld,
		private Camera: Camera,
	) { }

	Draw(entity: Id) {
		if (EntityTypeOf(entity) === this.Game.config.Constants.PlayerType)
			this.drawPlayer(entity)
		else
			this.drawGeneralEntity(entity)
	}

	private drawGeneralEntity(entity: Id) {
		const position = this.Game.entities.Position.get.of(entity)
		const velocity = this.Game.entities.Velocity.get.of(entity)
		const sprite = this.Game.config.EntityTypeMap.TypeFor(EntityTypeOf(entity))
		this.Camera.DrawAnimated(sprite, Layer.Middle, position, velocity)
	}

	private drawPlayer(entity: Id) {
		const position = this.Game.entities.Position.get.of(entity)
		const velocity = this.Game.entities.Velocity.get.of(entity)
		const sprite = this.Game.config.EntityTypeMap.TypeFor(EntityTypeOf(entity))
		this.Camera.DrawAnimated(sprite, Layer.Middle, position, velocity)
	}
}
