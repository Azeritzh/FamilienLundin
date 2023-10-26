import { MathF, Vector2, Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { Camera, Layer } from "../services/camera"
import { DisplayConfig } from "../state/display-config"
import { ViewDirection } from "../state/display-state"
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
		if (this.IsPerformingToolAction())
			this.DrawTool()
		this.Camera.DrawAnimated(SpriteFor(context.EntitySprites.Rotations, context.Orientation), Layer.Middle, context.Position, context.Velocity)
	}

	private IsPerformingToolAction() {
		return this.Game.State.Globals.Tick < (this.EntityContext.ToolState?.EndTime ?? 0)
	}

	private DrawTool() {
		const state = this.EntityContext.ToolState

		const animationProgress = (this.Game.State.Globals.Tick - state.StartTime) % 30
		const rotation = (animationProgress / 30) * (MathF.Tau / 4)
		const targetBlock = new Vector3(MathF.Floor(state.Target.X), MathF.Floor(state.Target.Y), MathF.Floor(state.Target.Z))
		const offset = new Vector2(0, -1.5).rotateFrom(rotation).addFromNumbers(-2, 0)
		const toolSprite = this.Config.ItemSprites.has(state.SourceItem.Type)
			? this.Config.ItemSprites.get(state.SourceItem.Type)
			: this.Config.BlockSprites.get(state.SourceItem.Content)[0].TileFor(ViewDirection.North)

		this.Camera.Draw(toolSprite,
			Layer.Middle,
			targetBlock.addFrom(new Vector3(0.5, 0.5, 0.5)).addFrom(this.Camera.BottomTile),
			this.EntityContext.Velocity,
			0, rotation,
			null, 1, false, offset)
	}
}
