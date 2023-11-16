import { Id } from "@lundin/age"
import { MathF, Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { BlockType, Blocks } from "../../state/block"
import { ItemKind } from "../../state/item"
import { Camera, Layer } from "../services/camera"
import { DisplayConfig } from "../state/display-config"
import { DisplayState } from "../state/display-state"

export class BlockMarkerDrawer {
	private Player: Id

	constructor(
		private Game: Meld,
		private Config: DisplayConfig,
		private State: DisplayState,
		private Camera: Camera,
	) { }

	Draw(player: Id) {
		this.Player = player
		if (this.ToolIs(ItemKind.Hammer))
			this.DrawBlockMarker()
	}

	private ToolIs(kind: ItemKind) {
		const tool = this.Game.Entities.SelectableTools.Get.Of(this.Player)?.CurrentTool()
		if (tool)
			return this.Game.Config.ItemValues.get(tool.Type)?.Kind === kind
		return false
	}

	private DrawBlockMarker() {
		const Game = this.Game
		const Config = this.Config
		const State = this.State
		const Camera = this.Camera
		const targetBlock = new Vector3(MathF.Floor(State.PointerTarget.X), MathF.Floor(State.PointerTarget.Y), MathF.Floor(State.PointerTarget.Z))
		const blockType = Blocks.TypeOf(Game.Terrain.GetAt(targetBlock))
		const height = this.switch(blockType)

		targetBlock.X += 0.5
		targetBlock.Y += 0.5
		Camera.BottomTile.multiply(0.5).addFrom(targetBlock)
		Camera.DrawAnimated(Config.GameplaySprites.BlockMarker.StraightFar,
			Layer.Middle + Layer.ZFightingAdjustment,
			Camera.BottomTile.multiply(-0.5).addFrom(targetBlock))
		Camera.DrawAnimated(Config.GameplaySprites.BlockMarker.StraightNear,
			Layer.Middle + Layer.ZFightingAdjustment,
			Camera.BottomTile.multiply(0.5).addFrom(targetBlock))
		Camera.DrawAnimated(Config.GameplaySprites.BlockMarker.Straight,
			Layer.Top + 1,
			targetBlock,
			null, null, null, null, 0.3)

		if (height == 0)
			return
		targetBlock.Z += height
		Camera.DrawAnimated(Config.GameplaySprites.BlockMarker.StraightTop,
			Layer.Top + 1,
			targetBlock,
			null, null, null, null, 0.3)
		Camera.DrawAnimated(Config.GameplaySprites.BlockMarker.StraightTop,
			Layer.Middle + Layer.AboveOverlayAdjustment,
			targetBlock)
	}

	private switch(blockType: BlockType) {
		switch (blockType) {
			case BlockType.Half: return 0.5
			case BlockType.Full: return 1
			default: return 0
		}
	}
}
