import { MathF, Vector2, Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { Camera, Layer } from "../services/camera"
import { DisplayConfig } from "../state/display-config"
import { ViewDirection } from "../state/display-state"
import { EntityContext } from "./entity-context"

export class HammerDrawer {
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
	}

	private IsPerformingToolAction() {
		return this.Game.State.Globals.Tick < (this.EntityContext.ToolState?.EndTime ?? 0)
	}

	private DrawTool() {
		const state = this.EntityContext.ToolState
		if(!state)
			return

		const startup = this.Game.Config.Constants.MiningStartup
		const recovery = this.Game.Config.Constants.MiningRecovery
		const progress = (this.Game.State.Globals.Tick - state.StartTime) % (startup + recovery)
		const rotation = progress < startup
			? this.StartupRotation(progress / startup)
			: this.RecoveryRotation((progress - startup) / recovery)
		const targetBlock = new Vector3(MathF.Floor(state.Target.X), MathF.Floor(state.Target.Y), MathF.Floor(state.Target.Z))
		const hammerPosition = targetBlock.addFrom(new Vector3(0.5, 0.5, 0.5)).addFrom(this.Camera.BottomTile.multiply(0.5))
		const offset = new Vector2(0, -1.25).rotateFrom(rotation).addFromNumbers(-1.75, 0.625)
		const toolSprite = this.Config.ItemSprites.has(state.SourceItem.Type)
			? this.Config.ItemSprites.get(state.SourceItem.Type)
			: this.Config.BlockSprites.get(state.SourceItem.Content)![0].TileFor(ViewDirection.North)

		this.Camera.Draw(toolSprite!,
			Layer.Middle,
			hammerPosition,
			this.EntityContext.Velocity,
			0, rotation,
			undefined, 1, false, offset)

		const markerOffset = new Vector2(0, -0.875).rotateFrom(rotation).addFromNumbers(-1.75, 0.625)
		this.Camera.Draw(this.Config.GameplaySprites.StandardMarker,
			Layer.Middle - Layer.ZFightingAdjustment,
			hammerPosition,
			this.EntityContext.Velocity,
			0, rotation,
			undefined, 1, false, markerOffset)
	}

	private StartupRotation(progress: number) {
		return MathF.Pow(progress, 4) * (MathF.Tau / 4)
	}

	private RecoveryRotation(progress: number) {
		return (1 - MathF.Min(progress, 1 - progress) * 0.25) * (MathF.Tau / 4)
	}
}
