import { Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { Block, Blocks, BlockType, SolidId } from "../../state/block"
import { Camera, Layer } from "../services/camera"
import { DisplayConfig } from "../state/display-config"
import { DisplayState } from "../state/display-state"

export class TerrainDrawer {
	static BlockCenter = new Vector3(0.5, 0.5, 0)
	static NoHeight = new Vector3(0, 0, 0)
	static FloorHeight = new Vector3(0, 0, 1 / 32) // should look like one pixel, so: 1/(WallHeight * PixelsPerTile)
	static HalfHeight = new Vector3(0, 0, 0.5)
	static FullHeight = new Vector3(0, 0, 1)

	// pre-allocated vectors:
	private Position = new Vector3(0, 0, 0)
	private TopPosition = new Vector3(0, 0, 0)
	private TopRightPosition = new Vector3(0, 0, 0)
	private RightPosition = new Vector3(0, 0, 0)
	private BottomRightPosition = new Vector3(0, 0, 0)
	private BottomPosition = new Vector3(0, 0, 0)
	private BottomLeftPosition = new Vector3(0, 0, 0)
	private LeftPosition = new Vector3(0, 0, 0)
	private TopLeftPosition = new Vector3(0, 0, 0)
	private Below = new Vector3(0, 0, -1)
	private Adjustable = new Vector3(0, 0, 0)

	constructor(
		private Game: Meld,
		private Config: DisplayConfig,
		private State: DisplayState,
		private Camera: Camera,
	) { }

	Draw() {
		for (let x = 0; x < this.State.VisibleBlocks.ChunkSize.x; x++)
			for (let y = 0; y < this.State.VisibleBlocks.ChunkSize.y; y++)
				for (let z = 0; z < this.State.VisibleBlocks.ChunkSize.z; z++)
					if (this.State.VisibleBlocks.GetWithoutOffset(x, y, z))
						this.DrawBlock(this.State.VisibleBlocks.Offset.x + x, this.State.VisibleBlocks.Offset.z + y, this.State.VisibleBlocks.Offset.z + z)
	}

	private DrawBlock(x: number, y: number, z: number) {
		const block = this.Game.Terrain.Get(x, y, z)
		if (block === null || block === undefined)
			return
		this.Position.set(x, y, z)
		this.updateDirections()
		this.DrawBlockTile(block, this.Position)
		this.DrawBlockWall(block, this.Position)
		if (this.Camera.IsDiagonalView())
			this.DrawDiagonalTileOverlays(block, this.Position)
		else
			this.DrawTileOverlays(block, this.Position)
		this.DrawWallOverlays(block, this.Position)
		this.DrawWallShadows(block, this.Position)
	}

	private updateDirections() {
		this.TopPosition.setFrom(this.Position).addFrom(this.Camera.TopTile)
		this.TopRightPosition.setFrom(this.Position).addFrom(this.Camera.TopRightTile)
		this.RightPosition.setFrom(this.Position).addFrom(this.Camera.RightTile)
		this.BottomRightPosition.setFrom(this.Position).addFrom(this.Camera.BottomRightTile)
		this.BottomPosition.setFrom(this.Position).addFrom(this.Camera.BottomTile)
		this.BottomLeftPosition.setFrom(this.Position).addFrom(this.Camera.BottomLeftTile)
		this.LeftPosition.setFrom(this.Position).addFrom(this.Camera.LeftTile)
		this.TopLeftPosition.setFrom(this.Position).addFrom(this.Camera.TopLeftTile)
	}

	private DrawBlockTile(block: Block, position: Vector3) {
		if (Blocks.TypeOf(block) === BlockType.Empty)
			return

		const layer = this.layerFor(Blocks.TypeOf(block))
		const height = TerrainDrawer.HeightOf(Blocks.TypeOf(block))
		const hasBlockAbove = Blocks.HasSolid(this.Game.Terrain.Get(position.x, position.y, position.z + 1)) ?? false
		const color = hasBlockAbove ? new Vector3(0.7, 0.7, 0.7) : null

		const finalPosition = this.Adjustable.setFrom(position).addFrom(height).addFrom(TerrainDrawer.BlockCenter)
		this.Camera.DrawAnimated(this.TileSpriteFor(block), layer, finalPosition, null, this.AnimationStartFor(position), 0, color)
	}

	private layerFor(blockType: BlockType) {
		switch (blockType) {
			case BlockType.Floor: return Layer.Floor
			case BlockType.Half: return Layer.Middle
			case BlockType.Full: return Layer.Bottom
			default: throw new Error("Invalid argument: No layer for empty blocks")
		}
	}

	public static HeightOf(blockType: BlockType) {
		switch (blockType) {
			case BlockType.Floor: return TerrainDrawer.FloorHeight
			case BlockType.Half: return TerrainDrawer.HalfHeight
			case BlockType.Full: return TerrainDrawer.FullHeight
			default: return TerrainDrawer.NoHeight
		}
	}

	private DrawBlockWall(block: Block, position: Vector3) {
		const smallestInFront = this.SmallestBlockInFrontOfCurrentPosition()
		const finalPosition = this.Adjustable.setFrom(position).addFrom(TerrainDrawer.BlockCenter)
		if (Blocks.TypeOf(block) === BlockType.Half && smallestInFront < BlockType.Half)
			this.Camera.DrawAnimated(this.HalfWallSpriteFor(block), Layer.Middle - Layer.ZFightingAdjustment, finalPosition, null, this.AnimationStartFor(position))
		if (Blocks.TypeOf(block) === BlockType.Full && smallestInFront !== BlockType.Full)
			this.Camera.DrawAnimated(this.FullWallSpriteFor(block), Layer.Middle, finalPosition, null, this.AnimationStartFor(position))
	}

	private SmallestBlockInFrontOfCurrentPosition() {
		if (!this.Camera.IsDiagonalView())
			return Blocks.TypeOf(this.Game.Terrain.GetAt(this.BottomPosition)) ?? BlockType.Empty
		const left = Blocks.TypeOf(this.Game.Terrain.GetAt(this.BottomLeftPosition)) ?? BlockType.Empty
		const right = Blocks.TypeOf(this.Game.Terrain.GetAt(this.BottomRightPosition)) ?? BlockType.Empty
		return left < right ? left : right
	}

	private DrawDiagonalTileOverlays(block: Block, position: Vector3) {
		const bottomRightBlock = this.Game.Terrain.GetAt(this.BottomRightPosition)
		if (bottomRightBlock !== null && bottomRightBlock !== undefined)
			this.DrawNeighbourTileOverlay(block, position, Side.TopLeft, bottomRightBlock, this.BottomRightPosition, Side.BottomRight)
		const bottomLeftBlock = this.Game.Terrain.GetAt(this.BottomLeftPosition)
		if (bottomLeftBlock !== null && bottomLeftBlock !== undefined)
			this.DrawNeighbourTileOverlay(block, position, Side.TopRight, bottomLeftBlock, this.BottomLeftPosition, Side.BottomLeft)
	}

	private DrawTileOverlays(block: Block, position: Vector3) {
		const rightBlock = this.Game.Terrain.GetAt(this.RightPosition)
		if (rightBlock !== null && rightBlock !== undefined)
			this.DrawNeighbourTileOverlay(block, position, Side.Left, rightBlock, this.RightPosition, Side.Right)
		else
			console.log("hej")
		const bottomBlock = this.Game.Terrain.GetAt(this.BottomPosition)
		if (bottomBlock !== null && bottomBlock !== undefined)
			this.DrawNeighbourTileOverlay(block, position, Side.Top, bottomBlock, this.BottomPosition, Side.Bottom)
	}

	private DrawNeighbourTileOverlay(blockA: Block, positionA: Vector3, sideA: Side, blockB: Block, positionB: Vector3, sideB: Side) {
		if (Blocks.TypeOf(blockA) === Blocks.TypeOf(blockB))
			return
		if (Blocks.TypeOf(blockA) < Blocks.TypeOf(blockB)) // we don't check skipping here, because we know from the other code that this never the bottom
			this.DrawTileOverlay(blockB, sideA, positionB)
		else if (!this.ShouldSkipOverlay(sideB, Blocks.TypeOf(blockA)))
			this.DrawTileOverlay(blockA, sideB, positionA)
	}

	private ShouldSkipOverlay(side: Side, type: BlockType) {
		if (type === BlockType.Floor)
			return false
		return side === Side.BottomRight
			|| side === Side.Bottom
			|| side === Side.BottomLeft
	}

	private DrawTileOverlay(block: Block, direction: Side, position: Vector3) {
		const blockLayer = this.TileLayerFor(Blocks.TypeOf(block))
		const layerAdjustment = this.LayerForSide(direction)
		const sprite = this.TileOverlayFor(Blocks.SolidOf(block), direction)
		const finalPosition = this.Adjustable.setFrom(position)
			.addFrom(TerrainDrawer.HeightOf(Blocks.TypeOf(block)))
			.addFrom(TerrainDrawer.BlockCenter)
		this.Camera.Draw(sprite, blockLayer + layerAdjustment, finalPosition)
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
		if (Blocks.TypeOf(block) === BlockType.Empty || Blocks.TypeOf(block) === BlockType.Floor)
			return

		const rightType = this.Camera.IsDiagonalView()
			? this.HighestBlockAmong(this.TopRightPosition, this.RightPosition, this.BottomRightPosition)
			: Blocks.TypeOf(this.Game.Terrain.GetAt(position.add(this.Camera.RightTile))) ?? BlockType.Empty
		if (rightType !== BlockType.Full)
			this.DrawWallOverlaysFor(block, position, rightType, Side.Right)

		const leftType = this.Camera.IsDiagonalView()
			? this.HighestBlockAmong(this.TopLeftPosition, this.LeftPosition, this.BottomLeftPosition)
			: Blocks.TypeOf(this.Game.Terrain.GetAt(position.add(this.Camera.LeftTile))) ?? BlockType.Empty
		if (leftType !== BlockType.Full)
			this.DrawWallOverlaysFor(block, position, leftType, Side.Left)
	}

	private DrawWallOverlaysFor(block: Block, position: Vector3, otherType: BlockType, side: Side) {
		const center = this.Adjustable.setFrom(position).addFrom(TerrainDrawer.BlockCenter)

		if (Blocks.TypeOf(block) === BlockType.Full && (otherType === BlockType.Empty || otherType === BlockType.Floor))
			this.Camera.Draw(this.FullWallOverlayFor(Blocks.SolidOf(block), side), Layer.Middle + Layer.OverlayWestAdjustment, center)
		else if (Blocks.TypeOf(block) === BlockType.Full && otherType === BlockType.Half)
			this.Camera.Draw(this.HalfWallOverlayFor(Blocks.SolidOf(block), side), Layer.Middle + Layer.OverlayWestAdjustment, center.addFrom(TerrainDrawer.HalfHeight))
		else if (Blocks.TypeOf(block) === BlockType.Half && (otherType === BlockType.Empty || otherType === BlockType.Floor))
			this.Camera.Draw(this.HalfWallOverlayFor(Blocks.SolidOf(block), side), Layer.Middle + Layer.OverlayWestAdjustment, center)
	}

	private HighestBlockAmong(tileA: Vector3, tileB: Vector3, tileC: Vector3) {
		let blockType = Blocks.TypeOf(this.Game.Terrain.GetAt(tileA)) ?? BlockType.Empty
		const nextBlock = this.Game.Terrain.GetAt(tileB)
		if (nextBlock !== null && nextBlock !== undefined)
			if (Blocks.TypeOf(nextBlock) > blockType)
				blockType = Blocks.TypeOf(nextBlock)
		const lastBlock = this.Game.Terrain.GetAt(tileC)
		if (lastBlock !== null && lastBlock !== undefined)
			if (Blocks.TypeOf(lastBlock) > blockType)
				blockType = Blocks.TypeOf(lastBlock)
		return blockType
	}

	private DrawWallShadows(leftBlock: Block, leftPosition: Vector3) {
		const rightBlock = this.Game.Terrain.GetAt(this.RightPosition)
		if (!rightBlock)
			return

		if (Blocks.TypeOf(leftBlock) === BlockType.Full) {
			if (Blocks.TypeOf(rightBlock) === BlockType.Empty && Blocks.TypeOf(this.Game.Terrain.GetAt(this.Adjustable.setFrom(this.RightPosition).addFrom(this.Below))) === BlockType.Full)
				this.Camera.Draw("default-wall-shadow-full-right", Layer.Bottom + Layer.OverlayWestAdjustment, this.getCenter(leftPosition))
			else if (Blocks.TypeOf(rightBlock) === BlockType.Floor)
				this.Camera.Draw("default-wall-shadow-full-right", Layer.Floor + Layer.OverlayWestAdjustment, this.getCenter(leftPosition).addFrom(TerrainDrawer.FloorHeight))
			else if (Blocks.TypeOf(rightBlock) === BlockType.Half)
				this.Camera.Draw("default-wall-shadow-half-right", Layer.Middle + Layer.OverlayWestAdjustment, this.getCenter(leftPosition).addFrom(TerrainDrawer.HalfHeight))
		}
		else if (Blocks.TypeOf(leftBlock) === BlockType.Half) {
			if (Blocks.TypeOf(rightBlock) === BlockType.Empty && Blocks.TypeOf(this.Game.Terrain.GetAt(this.Adjustable.setFrom(this.RightPosition).addFrom(this.Below))) === BlockType.Full)
				this.Camera.Draw("default-wall-shadow-half-right", Layer.Bottom + Layer.OverlayWestAdjustment, this.getCenter(leftPosition))
			else if (Blocks.TypeOf(rightBlock) === BlockType.Floor)
				this.Camera.Draw("default-wall-shadow-half-right", Layer.Floor + Layer.OverlayWestAdjustment, this.getCenter(leftPosition).addFrom(TerrainDrawer.FloorHeight))
			else if (Blocks.TypeOf(rightBlock) === BlockType.Full)
				this.Camera.Draw("default-wall-shadow-half-left", Layer.Middle + Layer.OverlayEastAdjustment, this.getCenter(leftPosition).addFrom(TerrainDrawer.HalfHeight))
		}
		else if (Blocks.TypeOf(leftBlock) === BlockType.Floor) {
			if (Blocks.TypeOf(rightBlock) === BlockType.Full)
				this.Camera.Draw("default-wall-shadow-full-left", Layer.Floor + Layer.OverlayEastAdjustment, this.getCenter(this.RightPosition).addFrom(TerrainDrawer.FloorHeight))
			else if (Blocks.TypeOf(rightBlock) === BlockType.Half)
				this.Camera.Draw("default-wall-shadow-half-left", Layer.Floor + Layer.OverlayEastAdjustment, this.getCenter(this.RightPosition).addFrom(TerrainDrawer.FloorHeight))
		}
		else if (Blocks.TypeOf(leftBlock) === BlockType.Empty && Blocks.TypeOf(this.Game.Terrain.GetAt(this.Adjustable.setFrom(leftPosition).addFrom(this.Below))) === BlockType.Full) {
			if (Blocks.TypeOf(rightBlock) === BlockType.Full)
				this.Camera.Draw("default-wall-shadow-full-left", Layer.Bottom + Layer.OverlayEastAdjustment, this.getCenter(this.RightPosition))
			else if (Blocks.TypeOf(rightBlock) === BlockType.Half)
				this.Camera.Draw("default-wall-shadow-half-left", Layer.Bottom + Layer.OverlayEastAdjustment, this.getCenter(this.RightPosition))
		}
	}

	private getCenter(position: Vector3) {
		return this.Adjustable.setFrom(position).addFrom(TerrainDrawer.BlockCenter)
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
			case Side.TopLeft: return tileOverlays.tileOverlayTopLeft
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
