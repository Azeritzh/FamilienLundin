import { Vector3 } from "@lundin/utility"
import { Block, Blocks, BlockType } from "../../state/block"
import { Camera, Layer } from "../services/camera"
import { DisplayConfig } from "../state/display-config"
import { BlockContext } from "./block-context"

export class BorderDrawer {
	constructor(
		private Config: DisplayConfig,
		private Camera: Camera,
	) { }
	BlockContext: BlockContext

	Draw(context: BlockContext) {
		this.BlockContext = context
		if (this.Camera.IsDiagonalView())
			this.DrawDiagonalTileOverlays()
		else
			this.DrawTileOverlays()
		if (this.BlockContext.BlockType != BlockType.Floor)
			this.DrawWallOverlays()
	}

	private DrawDiagonalTileOverlays() {
		this.DrawNeighbourTileOverlay(this.BlockContext.BottomRightBlock, Side.BottomRight)
		this.DrawNeighbourTileOverlay(this.BlockContext.BottomLeftBlock, Side.BottomLeft)
		this.DrawNeighbourTileOverlay(this.BlockContext.TopRightBlock, Side.TopRight)
		this.DrawNeighbourTileOverlay(this.BlockContext.TopLeftBlock, Side.TopLeft)
	}

	private DrawTileOverlays() {
		this.DrawNeighbourTileOverlay(this.BlockContext.RightBlock, Side.Right)
		this.DrawNeighbourTileOverlay(this.BlockContext.LeftBlock, Side.Left)
		this.DrawNeighbourTileOverlay(this.BlockContext.BottomBlock, Side.Bottom)
		this.DrawNeighbourTileOverlay(this.BlockContext.TopBlock, Side.Top)
	}

	private DrawNeighbourTileOverlay(otherBlock: Block, side: Side) {
		if (this.BlockContext.BlockType > Blocks.TypeOf(otherBlock) && !this.ShouldSkipOverlay(side, this.BlockContext.BlockType))
			this.DrawTileOverlay(side)
	}

	private ShouldSkipOverlay(side: Side, type: BlockType) {
		if (type === BlockType.Floor)
			return false
		return side === Side.BottomRight
			|| side === Side.Bottom
			|| side === Side.BottomLeft
	}

	private _adjustableDrawTileOverlay = new Vector3(0, 0, 0)
	private DrawTileOverlay(direction: Side) {
		const blockLayer = this.TileLayerFor(this.BlockContext.BlockType)
		const layerAdjustment = this.LayerForSide(direction)
		const sprite = this.TileOverlayFor(direction)
		const finalPosition = this._adjustableDrawTileOverlay.setFrom(this.BlockContext.Position)
			.addFrom(Camera.HeightOf(this.BlockContext.BlockType))
			.addFrom(Camera.BlockCenter)
		this.Camera.Draw(sprite, blockLayer + layerAdjustment, finalPosition, null, 0, 0, null, this.BlockContext.CurrentAlpha)
	}

	private TileLayerFor(blockType: BlockType) {
		switch (blockType) {
			case BlockType.Floor: return Layer.Floor
			case BlockType.Half: return Layer.Middle
			case BlockType.Full: return Layer.Bottom
			default: return Layer.Bottom
		}
	}

	private LayerForSide(direction: Side) {
		switch (direction) {
			case Side.Bottom:
			case Side.BottomLeft:
				return Layer.OverlayNorthAdjustment
			case Side.Top:
			case Side.TopRight:
				return Layer.OverlaySouthAdjustment
			case Side.Left:
			case Side.TopLeft:
				return Layer.OverlayEastAdjustment
			default: return Layer.OverlayWestAdjustment
		}
	}

	private DrawWallOverlays() {
		const rightType = this.Camera.IsDiagonalView()
			? this.HighestBlockAmong(this.BlockContext.TopRightBlock, this.BlockContext.RightBlock, this.BlockContext.BottomRightBlock)
			: Blocks.TypeOf(this.BlockContext.RightBlock)
		if (rightType !== BlockType.Full)
			this.DrawWallOverlaysFor(rightType, Side.Right)

		const leftType = this.Camera.IsDiagonalView()
			? this.HighestBlockAmong(this.BlockContext.TopLeftBlock, this.BlockContext.LeftBlock, this.BlockContext.BottomLeftBlock)
			: Blocks.TypeOf(this.BlockContext.LeftBlock)
		if (leftType !== BlockType.Full)
			this.DrawWallOverlaysFor(leftType, Side.Left)
	}

	private _adjustableDrawWallOverlaysFor = new Vector3(0, 0, 0)
	private DrawWallOverlaysFor(otherType: BlockType, side: Side) {
		const center = this._adjustableDrawWallOverlaysFor.setFrom(this.BlockContext.Position).addFrom(Camera.BlockCenter)

		if (this.BlockContext.BlockType === BlockType.Full && (otherType === BlockType.Empty || otherType === BlockType.Floor))
			this.Camera.Draw(this.FullWallOverlayFor(side), Layer.Middle + Layer.OverlayWestAdjustment, center, null, 0, 0, null, this.BlockContext.CurrentAlpha)
		else if (this.BlockContext.BlockType === BlockType.Full && otherType === BlockType.Half)
			this.Camera.Draw(this.HalfWallOverlayFor(side), Layer.Middle + Layer.OverlayWestAdjustment, center.addFrom(Camera.HalfHeight), null, 0, 0, null, this.BlockContext.CurrentAlpha)
		else if (this.BlockContext.BlockType === BlockType.Half && (otherType === BlockType.Empty || otherType === BlockType.Floor))
			this.Camera.Draw(this.HalfWallOverlayFor(side), Layer.Middle + Layer.OverlayWestAdjustment, center, null, 0, 0, null, this.BlockContext.CurrentAlpha)
	}

	private HighestBlockAmong(blockA: Block, blockB: Block, blockC: Block) {
		let blockType = Blocks.TypeOf(blockA)
		if (Blocks.TypeOf(blockB) > blockType)
			blockType = Blocks.TypeOf(blockB)
		if (Blocks.TypeOf(blockC) > blockType)
			blockType = Blocks.TypeOf(blockC)
		return blockType
	}

	private TileOverlayFor(direction: Side) {
		const solidType = Blocks.SolidOf(this.BlockContext.Block)
		const tileOverlays = this.Config.BlockTileOverlays.has(solidType)
			? this.Config.BlockTileOverlays.get(solidType)
			: this.Config.DefaultTileOverlays
		switch (direction) {
			case Side.Bottom: return tileOverlays.tileOverlayBottom
			case Side.Top: return tileOverlays.tileOverlayTop
			case Side.Left: return tileOverlays.tileOverlayLeft
			case Side.Right: return tileOverlays.tileOverlayRight
			case Side.TopLeft: return tileOverlays.tileOverlayTopLeft
			case Side.TopRight: return tileOverlays.tileOverlayTopRight
			case Side.BottomLeft: return tileOverlays.tileOverlayBottomLeft
			case Side.BottomRight: return tileOverlays.tileOverlayBottomRight
		}
	}

	private HalfWallOverlayFor(direction: Side) {
		const solidType = Blocks.SolidOf(this.BlockContext.Block)
		const wallOverlays = this.Config.BlockWallOverlays.has(solidType)
			? this.Config.BlockWallOverlays.get(solidType)
			: this.Config.DefaultWallOverlays
		switch (direction) {
			case Side.Left: return this.Camera.IsDiagonalView() ? wallOverlays.diagonalHalfWallOverlayLeft : wallOverlays.straightHalfWallOverlayLeft
			case Side.Right: return this.Camera.IsDiagonalView() ? wallOverlays.diagonalHalfWallOverlayRight : wallOverlays.straightHalfWallOverlayRight
		}
	}

	private FullWallOverlayFor(direction: Side) {
		const solidType = Blocks.SolidOf(this.BlockContext.Block)
		const wallOverlays = this.Config.BlockWallOverlays.has(solidType)
			? this.Config.BlockWallOverlays.get(solidType)
			: this.Config.DefaultWallOverlays
		switch (direction) {
			case Side.Left: return this.Camera.IsDiagonalView() ? wallOverlays.diagonalFullWallOverlayLeft : wallOverlays.straightFullWallOverlayLeft
			case Side.Right: return this.Camera.IsDiagonalView() ? wallOverlays.diagonalFullWallOverlayRight : wallOverlays.straightFullWallOverlayRight
		}
	}
}

enum Side {
	Bottom,
	Top,
	Left,
	Right,
	TopLeft,
	TopRight,
	BottomLeft,
	BottomRight,
}
