import { Id, EntityTypeOf } from "@lundin/age"
import { Meld } from "../meld"
import { Camera, Layer } from "./camera"

export class EntityDrawer {
	constructor(
		private Game: Meld,
		private Camera: Camera,
	) { }

	Draw(entity: Id) {
		if (EntityTypeOf(entity) === this.Game.Config.Constants.PlayerType)
			this.drawPlayer(entity)
		else
			this.drawGeneralEntity(entity)
	}

	private drawGeneralEntity(entity: Id) {
		const position = this.Game.Entities.Position.Get.Of(entity)
		const velocity = this.Game.Entities.Velocity.Get.Of(entity)
		const sprite = this.Game.Config.EntityTypeMap.TypeFor(EntityTypeOf(entity))
		this.Camera.DrawAnimated(sprite, Layer.Middle, position, velocity)
	}

	private drawPlayer(entity: Id) {
		const position = this.Game.Entities.Position.Get.Of(entity)
		const velocity = this.Game.Entities.Velocity.Get.Of(entity)
		const sprite = this.Game.Config.EntityTypeMap.TypeFor(EntityTypeOf(entity))
		this.Camera.DrawAnimated(sprite, Layer.Middle, position, velocity)
	}
}
