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

	private IsPerformingToolAction() {
		return this.Game.State.Globals.Tick < (this.EntityContext.ToolState?.EndTime ?? 0)
	}

	private DrawTool() {
		const state = this.EntityContext.ToolState

		const startup = this.Game.Config.Constants.MiningStartup
		const recovery = this.Game.Config.Constants.MiningRecovery
		const progress = (this.Game.State.Globals.Tick - state.StartTime) % (startup + recovery)
		const rotation = progress < startup
			? this.StartupRotation(progress / startup)
			: this.RecoveryRotation((progress - startup) / recovery)
		const targetBlock = new Vector3(MathF.Floor(state.Target.X), MathF.Floor(state.Target.Y), MathF.Floor(state.Target.Z))
		const offset = new Vector2(0, -1.25).rotateFrom(rotation).addFromNumbers(-1.75, 0.625)
		const toolSprite = this.Config.ItemSprites.has(state.SourceItem.Type)
			? this.Config.ItemSprites.get(state.SourceItem.Type)
			: this.Config.BlockSprites.get(state.SourceItem.Content)[0].TileFor(ViewDirection.North)

		this.Camera.Draw(toolSprite,
			Layer.Middle,
			targetBlock.addFrom(new Vector3(0.5, 0.5, 0.5)).addFrom(this.Camera.BottomTile.multiply(0.5)),
			this.EntityContext.Velocity,
			0, rotation,
			null, 1, false, offset)
	}

	private StartupRotation(progress: number) {
		return MathF.Pow(progress, 4) * (MathF.Tau / 4)
	}

	private RecoveryRotation(progress: number) {
		return (1 - MathF.Min(progress, 1 - progress) * 0.25) * (MathF.Tau / 4)
	}
}
