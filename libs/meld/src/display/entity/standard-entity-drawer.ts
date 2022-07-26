import { Meld } from "../../meld"
import { Camera, Layer } from "../services/camera"
import { DisplayConfig } from "../state/display-config"
import { RotationSprite, SpriteFor } from "../state/entity-sprites"
import { ItemAnimation } from "../state/item-animations"
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
		if (this.IsPerformingToolAction() && context.EntitySprites.HammerStrike)
			this.DrawTool(context.EntitySprites.HammerStrike, this.Config.ItemAnimations.HammerStrike)
		else
			this.Camera.DrawAnimated(SpriteFor(context.EntitySprites.Rotations, context.Orientation), Layer.Middle, context.Position, context.Velocity)
	}

	private IsPerformingToolAction() {
		return false // this.Game.State.Globals.Tick < (this.EntityContext.ToolState?.EndTime ?? 0)
	}

	private DrawTool(sprites: RotationSprite[], itemAnimations: ItemAnimation[]) {
		console.log(sprites, itemAnimations)
		/*const state = this.EntityContext.ToolState

		if (itemAnimations.For(EntityContext.Orientation, (Game.State.Globals.Tick - state.StartTime) % 30) is ItemPlacement placement)
		DrawItem(state.SourceItem, placement);

		var entitySprite = sprites.For(EntityContext.Orientation);
		Camera.DrawAnimated(entitySprite, Layer.Middle, EntityContext.Position, EntityContext.Velocity);*/
	}
}
