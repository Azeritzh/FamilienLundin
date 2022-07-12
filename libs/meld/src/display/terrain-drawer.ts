import { Vector3 } from "@lundin/utility"
import { Meld } from "../meld"
import { Block, Blocks, BlockType, SolidId } from "../state/block"
import { Camera, Layer } from "./camera"
import { DisplayConfig } from "./display-config"
import { DisplayState } from "./display-state"

export class TerrainDrawer {
	static BlockCenter = new Vector3(0.5, 0.5, 0)
	static FloorHeight = new Vector3(0, 0, 1 / 32) // should look like one pixel, so: 1/(WallHeight * PixelsPerTile)
	static HalfHeight = new Vector3(0, 0, 0.5)
	static FullHeight = new Vector3(0, 0, 1)

	constructor(
		private Game: Meld,
		private Config: DisplayConfig,
		private State: DisplayState,
		private Camera: Camera,
	) { }

	public DrawBlockContent(x: number, y: number, z: number) {
		const block = this.Game.Terrain.get(x, y, z)
		if (!block)
			return
		const position = new Vector3(x, y, z)
		this.DrawBlockTile(block, position)
		this.DrawBlockWall(block, position)
		if (this.Camera.IsDiagonalView())
			this.DrawDiagonalTileOverlays(block, position)
		else
			this.DrawTileOverlays(block, position)
		this.DrawWallOverlays(block, position)
		// this.DrawWallShadows(block, position, rightPosition) // disabled because transparency with webgl seems to be weird
	}

	private DrawBlockTile(block: Block, position: Vector3) {
		if (Blocks.TypeOf(block) === BlockType.Empty)
			return

		const layer = this.layerFor(Blocks.TypeOf(block))
		const height = this.heightFor(Blocks.TypeOf(block))

		this.Camera.DrawAnimated(this.TileSpriteFor(block), layer, position.add(height).add(TerrainDrawer.BlockCenter), null, this.AnimationStartFor(position))
	}

	private layerFor(blockType: BlockType) {
		switch (blockType) {
			case BlockType.Floor: return Layer.Floor
			case BlockType.Half: return Layer.Middle
			case BlockType.Full: return Layer.Top
			default: throw new Error("Invalid argument: No layer for empty blocks")
		}
	}

	private heightFor(blockType: BlockType) {
		switch (blockType) {
			case BlockType.Floor: return TerrainDrawer.FloorHeight
			case BlockType.Half: return TerrainDrawer.HalfHeight
			case BlockType.Full: return TerrainDrawer.FullHeight
			default: throw new Error("Invalid argument: No layer for empty blocks")
		}
	}

	private DrawBlockWall(block: Block, position: Vector3) {
		if (Blocks.TypeOf(block) === BlockType.Half)
			this.Camera.DrawAnimated(this.HalfWallSpriteFor(block), Layer.Middle - Layer.ZFightingAdjustment, position.add(TerrainDrawer.BlockCenter), null, this.AnimationStartFor(position))
		if (Blocks.TypeOf(block) === BlockType.Full)
			this.Camera.DrawAnimated(this.FullWallSpriteFor(block), Layer.Middle, position.add(TerrainDrawer.BlockCenter), null, this.AnimationStartFor(position))
	}

	private DrawDiagonalTileOverlays(block: Block, position: Vector3) {
		const bottomRightPosition = position.add(this.Camera.BottomRightTile)
		const bottomLeftPosition = position.add(this.Camera.BottomLeftTile)
		const bottomRightBlock = this.Game.Terrain.getAt(bottomRightPosition)
		if (bottomRightBlock !== null && bottomRightBlock != undefined)
			this.DrawNeighbourTileOverlay(block, position, Side.TopLeft, bottomRightBlock, bottomRightPosition, Side.BottomRight)
		const bottomLeftBlock = this.Game.Terrain.getAt(bottomLeftPosition)
		if (bottomLeftBlock !== null && bottomLeftBlock != undefined)
			this.DrawNeighbourTileOverlay(block, position, Side.TopRight, bottomLeftBlock, bottomLeftPosition, Side.BottomLeft)
	}

	private DrawTileOverlays(block: Block, position: Vector3) {
		const rightPosition = position.add(this.Camera.RightTile)
		const bottomPosition = position.add(this.Camera.BottomTile)
		const rightBlock = this.Game.Terrain.getAt(rightPosition)
		if (rightBlock !== null && rightBlock != undefined)
			this.DrawNeighbourTileOverlay(block, position, Side.Left, rightBlock, rightPosition, Side.Right)
		const bottomBlock = this.Game.Terrain.getAt(bottomPosition)
		if (bottomBlock !== null && bottomBlock != undefined)
			this.DrawNeighbourTileOverlay(block, position, Side.Top, bottomBlock, bottomPosition, Side.Bottom)
	}

	private DrawNeighbourTileOverlay(blockA: Block, positionA: Vector3, sideA: Side, blockB: Block, positionB: Vector3, sideB: Side) {
		if (Blocks.TypeOf(blockA) == Blocks.TypeOf(blockB))
			return
		if (Blocks.TypeOf(blockA) < Blocks.TypeOf(blockB)) // we don't check skipping here, because we know from the other code that this never the bottom
			this.DrawTileOverlay(blockB, sideA, positionB)
		else if (!this.ShouldSkipOverlay(sideB, Blocks.TypeOf(blockA)))
			this.DrawTileOverlay(blockA, sideB, positionA)
	}

	private ShouldSkipOverlay(side: Side, type: BlockType) {
		if (type == BlockType.Floor)
			return false
		return side == Side.BottomRight
			|| side == Side.Bottom
			|| side == Side.BottomLeft
	}

	private DrawTileOverlay(block: Block, direction: Side, position: Vector3) {
		const blockLayer = this.TileLayerFor(Blocks.TypeOf(block))
		const layerAdjustment = this.LayerForSide(direction)
		const center = this.heightFor(Blocks.TypeOf(block)).add(TerrainDrawer.BlockCenter)
		const sprite = this.TileOverlayFor(Blocks.SolidOf(block), direction)
		this.Camera.Draw(sprite, blockLayer + layerAdjustment, position.add(center))
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

	private DrawWallOverlays(block: Block, position: Vector3) {
		if (Blocks.TypeOf(block) == BlockType.Empty || Blocks.TypeOf(block) == BlockType.Floor)
			return

		const center = position.add(TerrainDrawer.BlockCenter)
		const rightType = this.Camera.IsDiagonalView()
			? this.HighestBlockAmong(position.add(this.Camera.TopRightTile), position.add(this.Camera.RightTile), position.add(this.Camera.BottomRightTile))
			: Blocks.TypeOf(this.Game.Terrain.getAt(position.add(this.Camera.RightTile))) ?? BlockType.Empty
		if (rightType != BlockType.Full)
			this.DrawWallOverlaysFor(block, center, rightType, Side.Right)

		const leftType = this.Camera.IsDiagonalView()
			? this.HighestBlockAmong(position.add(this.Camera.TopLeftTile), position.add(this.Camera.LeftTile), position.add(this.Camera.BottomLeftTile))
			: Blocks.TypeOf(this.Game.Terrain.getAt(position.add(this.Camera.LeftTile))) ?? BlockType.Empty
		if (leftType != BlockType.Full)
			this.DrawWallOverlaysFor(block, center, leftType, Side.Left)
	}

	private DrawWallOverlaysFor(block: Block, center: Vector3, otherType: BlockType, side: Side) {
		if (Blocks.TypeOf(block) == BlockType.Full && (otherType == BlockType.Empty || otherType == BlockType.Floor))
			this.Camera.Draw(this.FullWallOverlayFor(Blocks.SolidOf(block), side), Layer.Middle + Layer.OverlayWestAdjustment, center)
		else if (Blocks.TypeOf(block) == BlockType.Full && otherType == BlockType.Half)
			this.Camera.Draw(this.HalfWallOverlayFor(Blocks.SolidOf(block), side), Layer.Middle + Layer.OverlayWestAdjustment, center.add(TerrainDrawer.HalfHeight))
		else if (Blocks.TypeOf(block) == BlockType.Half && (otherType == BlockType.Empty || otherType == BlockType.Floor))
			this.Camera.Draw(this.HalfWallOverlayFor(Blocks.SolidOf(block), side), Layer.Middle + Layer.OverlayWestAdjustment, center)
	}

	private HighestBlockAmong(tileA: Vector3, tileB: Vector3, tileC: Vector3) {
		let blockType = Blocks.TypeOf(this.Game.Terrain.getAt(tileA)) ?? BlockType.Empty
		const nextBlock = this.Game.Terrain.getAt(tileB)
		if (nextBlock !== null && nextBlock !== undefined)
			if (Blocks.TypeOf(nextBlock) > blockType)
				blockType = Blocks.TypeOf(nextBlock)
		const lastBlock = this.Game.Terrain.getAt(tileC)
		if (lastBlock !== null && lastBlock !== undefined)
			if (Blocks.TypeOf(lastBlock) > blockType)
				blockType = Blocks.TypeOf(lastBlock)
		return blockType
	}

	private DrawWallShadows(leftBlock: Block, leftPosition: Vector3, rightPosition: Vector3) {
		const rightBlock = this.Game.Terrain.getAt(rightPosition)
		if (!rightBlock)
			return
		const leftCenter = leftPosition.add(TerrainDrawer.BlockCenter)
		const rightCenter = rightPosition.add(TerrainDrawer.BlockCenter)
		const below = new Vector3(0, 0, -1)

		if (Blocks.TypeOf(leftBlock) == BlockType.Full) {
			if (Blocks.TypeOf(rightBlock) == BlockType.Empty && Blocks.TypeOf(this.Game.Terrain.getAt(rightPosition.add(below))) == BlockType.Full)
				this.Camera.Draw("default-wall-shadow-full-right", Layer.Bottom + Layer.OverlayWestAdjustment, leftCenter)
			else if (Blocks.TypeOf(rightBlock) == BlockType.Floor)
				this.Camera.Draw("default-wall-shadow-full-right", Layer.Floor + Layer.OverlayWestAdjustment, leftCenter.add(TerrainDrawer.FloorHeight))
			else if (Blocks.TypeOf(rightBlock) == BlockType.Half)
				this.Camera.Draw("default-wall-shadow-half-right", Layer.Middle + Layer.OverlayWestAdjustment, leftCenter.add(TerrainDrawer.HalfHeight))
		}
		else if (Blocks.TypeOf(leftBlock) == BlockType.Half) {
			if (Blocks.TypeOf(rightBlock) == BlockType.Empty && Blocks.TypeOf(this.Game.Terrain.getAt(rightPosition.add(below))) == BlockType.Full)
				this.Camera.Draw("default-wall-shadow-half-right", Layer.Bottom + Layer.OverlayWestAdjustment, leftCenter)
			else if (Blocks.TypeOf(rightBlock) == BlockType.Floor)
				this.Camera.Draw("default-wall-shadow-half-right", Layer.Floor + Layer.OverlayWestAdjustment, leftCenter.add(TerrainDrawer.FloorHeight))
			else if (Blocks.TypeOf(rightBlock) == BlockType.Full)
				this.Camera.Draw("default-wall-shadow-half-left", Layer.Middle + Layer.OverlayEastAdjustment, rightCenter.add(TerrainDrawer.HalfHeight))
		}
		else if (Blocks.TypeOf(leftBlock) == BlockType.Floor) {
			if (Blocks.TypeOf(rightBlock) == BlockType.Full)
				this.Camera.Draw("default-wall-shadow-full-left", Layer.Floor + Layer.OverlayEastAdjustment, rightCenter.add(TerrainDrawer.FloorHeight))
			else if (Blocks.TypeOf(rightBlock) == BlockType.Half)
				this.Camera.Draw("default-wall-shadow-half-left", Layer.Floor + Layer.OverlayEastAdjustment, rightCenter.add(TerrainDrawer.FloorHeight))
		}
		else if (Blocks.TypeOf(leftBlock) == BlockType.Empty && Blocks.TypeOf(this.Game.Terrain.getAt(leftPosition.add(below))) == BlockType.Full) {
			if (Blocks.TypeOf(rightBlock) == BlockType.Full)
				this.Camera.Draw("default-wall-shadow-full-left", Layer.Bottom + Layer.OverlayEastAdjustment, rightCenter)
			else if (Blocks.TypeOf(rightBlock) == BlockType.Half)
				this.Camera.Draw("default-wall-shadow-half-left", Layer.Bottom + Layer.OverlayEastAdjustment, rightCenter)
		}
	}

	private TileSpriteFor(block: Block) {
		return this.Config.BlockSprites.get(Blocks.SolidOf(block))[Blocks.VariantOf(block)].TileFor(this.State.ViewDirection)
	}

	private FullWallSpriteFor(block: Block) {
		return this.Config.BlockSprites.get(Blocks.SolidOf(block))[Blocks.VariantOf(block)].FullWallFor(this.State.ViewDirection)
	}

	private HalfWallSpriteFor(block: Block) {
		return this.Config.BlockSprites.get(Blocks.SolidOf(block))[Blocks.VariantOf(block)].HalfWallFor(this.State.ViewDirection)
	}

	private TileOverlayFor(solidType: SolidId, direction: Side) {
		const tileOverlays = this.Config.BlockTileOverlays.has(solidType)
			? this.Config.BlockTileOverlays.get(solidType)
			: this.Config.DefaultTileOverlays
		switch (direction) {
			case Side.Bottom: return tileOverlays.tileOverlayBottom
			case Side.Top: return tileOverlays.tileOverlayTop
			case Side.Left: return tileOverlays.tileOverlayLeft
			case Side.Right: return tileOverlays.tileOverlayRight
			case Side.TopLeft: return tileOverlays.tileOverlayRight
			case Side.TopRight: return tileOverlays.tileOverlayTopRight
			case Side.BottomLeft: return tileOverlays.tileOverlayBottomLeft
			case Side.BottomRight: return tileOverlays.tileOverlayBottomRight
		}
	}

	private HalfWallOverlayFor(solidType: SolidId, direction: Side) {
		const wallOverlays = this.Config.BlockWallOverlays.has(solidType)
			? this.Config.BlockWallOverlays.get(solidType)
			: this.Config.DefaultWallOverlays
		switch (direction) {
			case Side.Left: return this.Camera.IsDiagonalView() ? wallOverlays.diagonalHalfWallOverlayLeft : wallOverlays.straightHalfWallOverlayLeft
			case Side.Right: return this.Camera.IsDiagonalView() ? wallOverlays.diagonalHalfWallOverlayRight : wallOverlays.straightHalfWallOverlayRight
		}
	}

	private FullWallOverlayFor(solidType: SolidId, direction: Side) {
		const wallOverlays = this.Config.BlockWallOverlays.has(solidType)
			? this.Config.BlockWallOverlays.get(solidType)
			: this.Config.DefaultWallOverlays
		switch (direction) {
			case Side.Left: return this.Camera.IsDiagonalView() ? wallOverlays.diagonalFullWallOverlayLeft : wallOverlays.straightFullWallOverlayLeft
			case Side.Right: return this.Camera.IsDiagonalView() ? wallOverlays.diagonalFullWallOverlayRight : wallOverlays.straightFullWallOverlayRight
		}
	}

	private AnimationStartFor(position: Vector3) {
		let x = position.x
		let y = position.y
		let z = position.z
		if (x == 0)
			x = 1234
		if (y == 0)
			y = 1234
		if (z == 0)
			z = 1234
		const number = (x / 13 + y / 31 + z / 71) * 345
		return Math.floor(10000 * (number - Math.floor(number)))
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
