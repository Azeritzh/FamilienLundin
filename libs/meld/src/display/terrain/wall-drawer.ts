import { Vector3 } from "@lundin/utility"
import { Blocks, BlockType } from "../../state/block"
import { Camera, Layer } from "../services/camera"
import { DisplayConfig } from "../state/display-config"
import { DisplayState } from "../state/display-state"
import { BlockContext } from "./block-context"

export class WallDrawer {
	constructor(
		private Config: DisplayConfig,
		private State: DisplayState,
		private Camera: Camera,
	) { }
	BlockContext: BlockContext

	private _adjustableDraw = new Vector3(0, 0, 0)
	Draw(context: BlockContext) {
		this.BlockContext = context
		const smallestInFront = this.SmallestBlockInFront()
		const finalPosition = this._adjustableDraw.setFrom(this.BlockContext.Position).addFrom(Camera.BlockCenter)
		if (this.BlockContext.BlockType === BlockType.Half && !this.ShouldSkipHalfWall(smallestInFront))
			this.Camera.DrawAnimated(this.HalfWallSprite(), Layer.Middle - Layer.ZFightingAdjustment, finalPosition, null, this.BlockContext.AnimationStart, 0, null, this.BlockContext.CurrentAlpha, true)
		if (this.BlockContext.BlockType === BlockType.Full && !this.ShouldSkipFullWall(smallestInFront))
			this.Camera.DrawAnimated(this.FullWallSprite(), Layer.Middle, finalPosition, null, this.BlockContext.AnimationStart, 0, null, this.BlockContext.CurrentAlpha, true)
	}

	private SmallestBlockInFront() {
		if (!this.Camera.IsDiagonalView())
			return Blocks.TypeOf(this.BlockContext.BottomBlock)
		const left = Blocks.TypeOf(this.BlockContext.BottomLeftBlock)
		const right = Blocks.TypeOf(this.BlockContext.BottomRightBlock)
		return left < right ? left : right
	}

	private ShouldSkipHalfWall(smallestInFront: BlockType) {
		return BlockType.Half <= smallestInFront
	}

	private _adjustableShouldSkipFullWall = new Vector3(0, 0, 0)
	private ShouldSkipFullWall(smallestInFront: BlockType) {
		const position = this.BlockContext.Position
		const pos = this._adjustableShouldSkipFullWall
		const isDiagonal = this.Camera.IsDiagonalView()
		const northFree = isDiagonal
			? this.State.VisibleBlocks.GetAt(pos.setFrom(position).addFrom(this.Camera.TopLeftTile)) && Blocks.TypeOf(this.BlockContext.TopLeftBlock) !== BlockType.Full
			: this.State.VisibleBlocks.GetAt(pos.setFrom(position).addFrom(this.Camera.TopTile)) && Blocks.TypeOf(this.BlockContext.TopBlock) !== BlockType.Full
		const eastFree = isDiagonal
			? this.State.VisibleBlocks.GetAt(pos.setFrom(position).addFrom(this.Camera.TopRightTile)) && Blocks.TypeOf(this.BlockContext.TopRightBlock) !== BlockType.Full
			: this.State.VisibleBlocks.GetAt(pos.setFrom(position).addFrom(this.Camera.RightTile)) && Blocks.TypeOf(this.BlockContext.RightBlock) !== BlockType.Full
		const southFree = isDiagonal
			? this.State.VisibleBlocks.GetAt(pos.setFrom(position).addFrom(this.Camera.BottomRightTile)) && Blocks.TypeOf(this.BlockContext.BottomRightBlock) !== BlockType.Full
			: this.State.VisibleBlocks.GetAt(pos.setFrom(position).addFrom(this.Camera.BottomTile)) && Blocks.TypeOf(this.BlockContext.BottomBlock) !== BlockType.Full
		const westFree = isDiagonal
			? this.State.VisibleBlocks.GetAt(pos.setFrom(position).addFrom(this.Camera.BottomLeftTile)) && Blocks.TypeOf(this.BlockContext.BottomLeftBlock) !== BlockType.Full
			: this.State.VisibleBlocks.GetAt(pos.setFrom(position).addFrom(this.Camera.LeftTile)) && Blocks.TypeOf(this.BlockContext.LeftBlock) !== BlockType.Full
		return smallestInFront === BlockType.Full && !northFree && !eastFree && !southFree && !westFree
	}

	private FullWallSprite() {
		const block = this.BlockContext.Block
		return this.Config.BlockSprites.get(Blocks.SolidOf(block))[Blocks.VariantOf(block)].FullWallFor(this.State.ViewDirection)
	}

	private HalfWallSprite() {
		const block = this.BlockContext.Block
		return this.Config.BlockSprites.get(Blocks.SolidOf(block))[Blocks.VariantOf(block)].HalfWallFor(this.State.ViewDirection)
	}
}
