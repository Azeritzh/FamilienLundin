import { Tau } from "@lundin/utility"
import { Meld } from "../../meld"
import { Item } from "../../state/item"
import { Camera, Layer } from "../services/camera"
import { DisplayConfig } from "../state/display-config"
import { ViewDirection } from "../state/display-state"
import { RotationSprite, SpriteFor } from "../state/entity-sprites"
import { ItemAnimation, ItemPlacement, ItemPlacementFor } from "../state/item-animations"
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
		return this.Game.State.Globals.Tick < (this.EntityContext.ToolState?.EndTime ?? 0)
	}

	private DrawTool(sprites: RotationSprite[], itemAnimations: ItemAnimation[]) {
		const state = this.EntityContext.ToolState

		const placement = ItemPlacementFor(itemAnimations, this.EntityContext.Orientation, (this.Game.State.Globals.Tick - state.StartTime) % 30)
		if (placement)
			this.DrawItem(state.SourceItem, placement)

		const entitySprite = SpriteFor(sprites, this.EntityContext.Orientation)
		this.Camera.DrawAnimated(entitySprite, Layer.Middle, this.EntityContext.Position, this.EntityContext.Velocity)
	}

	private DrawItem(item: Item, placement: ItemPlacement) {
		const toolSprite = this.Config.ItemSprites.has(item.Type)
			? this.Config.ItemSprites.get(item.Type)
			: this.Config.BlockSprites.get(item.Content)[0].TileFor(ViewDirection.North)
		const layer = placement.InFront
			? Layer.Middle + Layer.ZFightingAdjustment
			: Layer.Middle - Layer.ZFightingAdjustment
		this.Camera.DrawAnimated(toolSprite, layer, this.EntityContext.Position, this.EntityContext.Velocity, 0, placement.Rotation * Tau, null, 1, false, placement.OffsetX, placement.OffsetY)
	}
}
