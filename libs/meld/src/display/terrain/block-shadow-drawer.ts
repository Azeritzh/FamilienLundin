import { Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { Block, Blocks, BlockType } from "../../state/block"
import { Camera, Layer } from "../services/camera"
import { DisplayConfig } from "../state/display-config"
import { BlockContext } from "./block-context"

export class BlockShadowDrawer {
	constructor(
		private Config: DisplayConfig,
		private Camera: Camera,
		private Game: Meld,
	) { }
	BlockContext: BlockContext

	Draw(context: BlockContext) {
		this.BlockContext = context
		if (this.BlockContext.BlockType === BlockType.Floor)
			return
		if (this.Camera.IsDiagonalView())
			this.DrawDiagonalShadows()
		else
			this.DrawStraightShadows()
	}

	private _adjustableDrawDiagonalShadows = new Vector3(0, 0, 0)
	private DrawDiagonalShadows() {
		const position = this._adjustableDrawDiagonalShadows.setFrom(this.BlockContext.Position)
			.addFrom(this.Camera.BottomRightTile)
			.addFrom(Camera.BlockCenter)
		this.DrawStraightShadowsBy(
			this.Config.GameplaySprites.Shadow.WallHalfDiagonal,
			this.Config.GameplaySprites.Shadow.WallFullDiagonal,
			position,
			this.BlockContext.BottomRightBlock)
	}

	private _adjustableDrawStraightShadows = new Vector3(0, 0, 0)
	private DrawStraightShadows() {
		let position = this._adjustableDrawStraightShadows.setFrom(this.BlockContext.Position)
			.addFrom(this.Camera.LeftTile)
			.addFrom(Camera.BlockCenter)
		this.DrawStraightShadowsBy(
			this.Config.GameplaySprites.Shadow.WallHalfLeft,
			this.Config.GameplaySprites.Shadow.WallFullLeft,
			position,
			this.BlockContext.LeftBlock)

		position = this._adjustableDrawStraightShadows.setFrom(this.BlockContext.Position)
			.addFrom(this.Camera.RightTile)
			.addFrom(Camera.BlockCenter)
		this.DrawStraightShadowsBy(
			this.Config.GameplaySprites.Shadow.WallHalfRight,
			this.Config.GameplaySprites.Shadow.WallFullRight,
			position,
			this.BlockContext.RightBlock)
	}

	private _adjustable = new Vector3(0, 0, 0)
	private DrawStraightShadowsBy(halfSprite: string, fullSprite: string, spriteCenter: Vector3, otherBlock: Block) {
		if (this.BlockContext.BlockType == BlockType.Half) {
			if (Blocks.TypeOf(otherBlock) == BlockType.Empty && Blocks.TypeOf(this.Game.Terrain.GetAt(this._adjustable.setFrom(spriteCenter).addFrom(Camera.Below))) == BlockType.Full)
				this.Camera.Draw(halfSprite, Layer.Bottom + Layer.OverlayWestAdjustment, spriteCenter)
			else if (Blocks.TypeOf(otherBlock) == BlockType.Floor)
				this.Camera.Draw(halfSprite, Layer.Floor + Layer.OverlayWestAdjustment, this._adjustable.setFrom(spriteCenter).addFrom(Camera.FloorHeight))
		}
		else if (this.BlockContext.BlockType == BlockType.Full) {
			if (Blocks.TypeOf(otherBlock) == BlockType.Empty && Blocks.TypeOf(this.Game.Terrain.GetAt(this._adjustable.setFrom(spriteCenter).addFrom(Camera.Below))) == BlockType.Full)
				this.Camera.Draw(fullSprite, Layer.Bottom + Layer.OverlayWestAdjustment, spriteCenter)
			else if (Blocks.TypeOf(otherBlock) == BlockType.Floor)
				this.Camera.Draw(fullSprite, Layer.Floor + Layer.OverlayWestAdjustment, this._adjustable.setFrom(spriteCenter).addFrom(Camera.FloorHeight))
			else if (Blocks.TypeOf(otherBlock) == BlockType.Half)
				this.Camera.Draw(halfSprite, Layer.Middle + Layer.OverlayWestAdjustment, this._adjustable.setFrom(spriteCenter).addFrom(Camera.HalfHeight))
		}
	}
}
