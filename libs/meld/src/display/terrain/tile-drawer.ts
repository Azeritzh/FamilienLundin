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
	BlockContext!: BlockContext

	Draw(context: BlockContext) {
		this.BlockContext = context
		this.DrawTileBelowTransparent()
		this.DrawBlockTile()
	}

	private _adjustableDrawBlockTile = new Vector3(0, 0, 0)
	private DrawBlockTile() {
		const layer = this.layerFor(this.BlockContext.BlockType)
		const height = Camera.HeightOf(this.BlockContext.BlockType)
		const color = this.HasBlockAbove() ? new Vector3(0.7, 0.7, 0.7) : null

		const finalPosition = this._adjustableDrawBlockTile.setFrom(this.BlockContext.Position).addFrom(height).addFrom(Camera.BlockCenter)
		this.Camera.DrawAnimated(this.TileSprite(), layer, finalPosition, null, this.BlockContext.AnimationStart, 0, color, this.BlockContext.CurrentAlpha, true)
	}

	private layerFor(blockType: BlockType) {
		switch (blockType) {
			case BlockType.Floor: return Layer.Floor
			case BlockType.Half: return Layer.Middle
			case BlockType.Full: return Layer.Top
			default: throw new Error("Invalid argument: No layer for empty blocks")
		}
	}

	private _adjustableHasBlockAbove = new Vector3(0, 0, 0)
	private HasBlockAbove() {
		if (Blocks.HasSolid(this.Game.Terrain.GetAt(this._adjustableHasBlockAbove.setFrom(this.BlockContext.Position).addFrom(Camera.Above))))
			return true
		if (this.BlockContext.BlockType == BlockType.Full)
			return Blocks.HasSolid(this.Game.Terrain.GetAt(this._adjustableHasBlockAbove.setFrom(this.BlockContext.Position).addFrom(Camera.Above).addFrom(Camera.Above)))
		return false
	}

	private _adjustableDrawTileBelowTransparent = new Vector3(0, 0, 0)
	private DrawTileBelowTransparent() {
		if (this.BlockContext.CurrentAlpha == 1)
			return
		const position = this._adjustableDrawTileBelowTransparent.setFrom(this.BlockContext.Position)
		this.Camera.DrawAnimated(this.TileSprite(), Layer.Bottom, position.addFrom(Camera.BlockCenter), null, this.BlockContext.AnimationStart, 0, null, this.BlockContext.CurrentAlpha, true)
	}

	private TileSprite() {
		const block = this.BlockContext.Block
		return this.Config.BlockSprites.get(Blocks.SolidOf(block))![Blocks.VariantOf(block)].TileFor(this.State.ViewDirection)
	}
}
