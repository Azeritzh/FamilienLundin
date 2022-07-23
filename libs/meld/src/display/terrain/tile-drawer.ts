import { Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { Blocks, BlockType } from "../../state/block"
import { Camera, Layer } from "../services/camera"
import { DisplayConfig } from "../state/display-config"
import { DisplayState } from "../state/display-state"
import { BlockContext } from "./block-context"

export class TileDrawer {
	constructor(
		private Config: DisplayConfig,
		private State: DisplayState,
		private Camera: Camera,
		private Game: Meld,
	) { }
	BlockContext: BlockContext

	Draw(context: BlockContext) {
		this.BlockContext = context
		this.DrawBlockTile()
	}

	private _adjustableDrawBlockTile = new Vector3(0, 0, 0)
	private DrawBlockTile() {
		const layer = this.layerFor(this.BlockContext.BlockType)
		const height = Camera.HeightOf(this.BlockContext.BlockType)
		const color = this.HasBlockAbove() ? new Vector3(0.7, 0.7, 0.7) : null

		const finalPosition = this._adjustableDrawBlockTile.setFrom(this.BlockContext.Position).addFrom(height).addFrom(Camera.BlockCenter)
		this.Camera.DrawAnimated(this.TileSprite(), layer, finalPosition, null, this.BlockContext.AnimationStart, 0, color, this.BlockContext.CurrentAlpha)
	}

	private layerFor(blockType: BlockType) {
		switch (blockType) {
			case BlockType.Floor: return Layer.Floor
			case BlockType.Half: return Layer.Middle
			case BlockType.Full: return Layer.Bottom
			default: throw new Error("Invalid argument: No layer for empty blocks")
		}
	}

	private _adjustableHasBlockAbove = new Vector3(0, 0, 0)
	private HasBlockAbove() {
		if (Blocks.HasSolid(this.Game.Terrain.GetAt(this._adjustableHasBlockAbove.setFrom(this.BlockContext.Position).addFrom(Camera.Above))) ?? false)
			return true
		if (this.BlockContext.BlockType == BlockType.Full)
			return Blocks.HasSolid(this.Game.Terrain.GetAt(this._adjustableHasBlockAbove.setFrom(this.BlockContext.Position).addFrom(Camera.Above).addFrom(Camera.Above))) ?? false
		return false
	}

	private TileSprite() {
		const block = this.BlockContext.Block
		return this.Config.BlockSprites.get(Blocks.SolidOf(block))[Blocks.VariantOf(block)].TileFor(this.State.ViewDirection)
	}
}
