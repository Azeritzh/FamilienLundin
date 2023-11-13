import { Meld } from "../../meld"
import { Camera, Layer } from "../services/camera"
import { DisplayConfig } from "../state/display-config"
import { SpriteFor } from "../state/entity-sprites"
import { EntityContext } from "./entity-context"

export class StandardEntityDrawer {
	private EntityContext = new EntityContext()

	constructor(
		private Game: Meld,
		private Config: DisplayConfig,
		private Camera: Camera,
	) { }

	Draw(context: EntityContext) {
		this.EntityContext = context
		this.Camera.DrawAnimated(SpriteFor(this.GetCurrentSprite(), context.Orientation), Layer.Middle, context.Position, context.Velocity)
	}

	private GetCurrentSprite() {
		const speed = this.EntityContext.Velocity.Length()
		if (speed > this.Game.Config.Constants.MaxMoveSpeed * 1.01)
			return this.EntityContext.EntitySprites.Dash ?? this.EntityContext.EntitySprites.Idle
		if (speed > this.Game.Config.Constants.MaxMoveSpeed * 0.75)
			return this.EntityContext.EntitySprites.Run ?? this.EntityContext.EntitySprites.Idle
		if (speed > this.Game.Config.Constants.MaxMoveSpeed * 0.01)
			return this.EntityContext.EntitySprites.Walk ?? this.EntityContext.EntitySprites.Idle
		return this.EntityContext.EntitySprites.Idle
	}
}
