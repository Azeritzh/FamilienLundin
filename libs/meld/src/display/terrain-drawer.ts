import { Vector3 } from "@lundin/utility"
import { Meld } from "../meld"
import { Block, Blocks, BlockType } from "../state/block"
import { Camera, Layer } from "./camera"
import { DisplayConfig } from "./display-config"

export class TerrainDrawer {
	static BlockCenter = new Vector3(0.5, 0.5, 0)
	static FloorHeight = new Vector3(0, 0, 1 / 32) // should look like one pixel, so: 1/(WallHeight * PixelsPerTile)
	static HalfHeight = new Vector3(0, 0, 0.5)
	static FullHeight = new Vector3(0, 0, 1)

	constructor(
		private Game: Meld,
		private Config: DisplayConfig,
		private Camera: Camera,
	) { }

	public DrawBlockContent(x: number, y: number, z: number) {
		const block = this.Game.terrain.get(x, y, z)
		if (!block)
			return
		const position = new Vector3(x, y, z)
		const rightPosition = position.add(this.Camera.rightPosition)
		this.drawBlockTile(block, position)
		this.drawBlockWall(block, position)
		this.drawTileOverlays(block, position)
		this.drawWallOverlays(block, position, rightPosition)
		// this.drawWallShadows(block, position, rightPosition) // disabled because transparency with webgl seem to be weird
	}

	private drawBlockTile(block: Block, position: Vector3) {
		if (Blocks.TypeOf(block) === BlockType.Empty)
			return
		const solidType = this.Game.config.SolidTypeMap.TypeFor(Blocks.SolidOf(block))
		if (solidType == null)
			return

		const layer = this.layerFor(Blocks.TypeOf(block))
		const height = this.heightFor(Blocks.TypeOf(block))

		this.Camera.DrawVaried(solidType + "-tile", layer, position.add(height).add(TerrainDrawer.BlockCenter), null, this.variantFor(position))
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

	private drawBlockWall(block: Block, position: Vector3) {
		if (Blocks.TypeOf(block) === BlockType.Empty || Blocks.TypeOf(block) === BlockType.Floor)
			return
		const solidType = this.Game.config.SolidTypeMap.TypeFor(Blocks.SolidOf(block))
		if (solidType == null)
			return

		if (Blocks.TypeOf(block) === BlockType.Half)
			this.Camera.DrawVaried(solidType + "-wall", Layer.Middle - Layer.ZFightingAdjustment, position.add(TerrainDrawer.BlockCenter), null, this.variantFor(position))
		if (Blocks.TypeOf(block) === BlockType.Full)
			this.Camera.DrawVaried(solidType + "-wall", Layer.Middle, position.add(TerrainDrawer.BlockCenter), null, this.variantFor(position))
	}

	private drawTileOverlays(block: Block, position: Vector3) {
		const rightPosition = position.add(this.Camera.rightPosition)
		const bottomPosition = position.add(this.Camera.bottomPosition)
		const rightBlock = this.Game.terrain.getAt(rightPosition)
		if (rightBlock)
			this.drawRightLeftTileOverlay(block, position, rightBlock, rightPosition)
		const bottomBlock = this.Game.terrain.getAt(bottomPosition)
		if (bottomBlock)
			this.drawTopBottomTileOverlay(block, position, bottomBlock, bottomPosition)
	}

	private drawTopBottomTileOverlay(topBlock: Block, topPosition: Vector3, bottomBlock: Block, bottomPosition: Vector3) {
		if (Blocks.TypeOf(topBlock) == Blocks.TypeOf(bottomBlock))
			return
		if (Blocks.TypeOf(topBlock) < Blocks.TypeOf(bottomBlock))
			this.drawTileOverlay(bottomBlock, Side.Top, bottomPosition)
		else if (Blocks.TypeOf(topBlock) == BlockType.Floor) // only case with overlay from top block
			this.drawTileOverlay(topBlock, Side.Bottom, topPosition)
	}

	private drawRightLeftTileOverlay(leftBlock: Block, leftPosition: Vector3, rightBlock: Block, rightPosition: Vector3) {
		if (Blocks.TypeOf(leftBlock) == Blocks.TypeOf(rightBlock))
			return
		if (Blocks.TypeOf(leftBlock) < Blocks.TypeOf(rightBlock))
			this.drawTileOverlay(rightBlock, Side.Left, rightPosition)
		else
			this.drawTileOverlay(leftBlock, Side.Right, leftPosition)
	}

	private drawTileOverlay(block: Block, direction: Side, position: Vector3) {
		const blockLayer = this.tileLayerFor(Blocks.TypeOf(block))
		const layerAdjustment = this.layerForSide(direction)
		const center = this.heightFor(Blocks.TypeOf(block)).add(TerrainDrawer.BlockCenter)
		const sprite = this.tileOverlayFor(block, direction)
		this.Camera.Draw(sprite, blockLayer + layerAdjustment, position.add(center))
	}


	private tileLayerFor(blockType: BlockType) {
		switch (blockType) {
			case BlockType.Floor: return Layer.Floor
			case BlockType.Half: return Layer.Middle
			case BlockType.Full: return Layer.Bottom
			default: return Layer.Bottom
		}
	}

	private layerForSide(direction: Side) {
		switch (direction) {
			case Side.Bottom: return Layer.OverlayNorthAdjustment
			case Side.Top: return Layer.OverlaySouthAdjustment
			case Side.Left: return Layer.OverlayEastAdjustment
			default: return Layer.OverlayWestAdjustment
		}
	}

	private tileOverlayFor(block: Block, direction: Side) {
		const typeName = this.Game.config.SolidTypeMap.TypeFor(Blocks.SolidOf(block)) ?? ""
		const aber = typeName == "grass" ? "grass" : "default"
		switch (direction) {
			case Side.Bottom: return aber + "-tile-overlay-bottom"
			case Side.Top: return aber + "-tile-overlay-top"
			case Side.Left: return aber + "-tile-overlay-left"
			case Side.Right: return aber + "-tile-overlay-right"
		}
	}

	private drawWallOverlays(leftBlock: Block, leftPosition: Vector3, rightPosition: Vector3) {
		const rightBlock = this.Game.terrain.getAt(rightPosition)
		if (!rightBlock)
			return
		const leftCenter = leftPosition.add(TerrainDrawer.BlockCenter)
		const rightCenter = rightPosition.add(TerrainDrawer.BlockCenter)

		if (Blocks.TypeOf(leftBlock) == BlockType.Full) {
			if (Blocks.TypeOf(rightBlock) == BlockType.Empty || Blocks.TypeOf(rightBlock) == BlockType.Floor)
				this.Camera.Draw(this.WallOverlayFullRightFor(leftBlock), Layer.Middle + Layer.OverlayWestAdjustment, leftCenter)
			else if (Blocks.TypeOf(rightBlock) == BlockType.Half)
				this.Camera.Draw(this.WallOverlayHalfRightFor(leftBlock), Layer.Middle + Layer.OverlayWestAdjustment, leftCenter.add(TerrainDrawer.HalfHeight))
		}
		else if (Blocks.TypeOf(leftBlock) == BlockType.Half) {
			if (Blocks.TypeOf(rightBlock) == BlockType.Empty || Blocks.TypeOf(rightBlock) == BlockType.Floor)
				this.Camera.Draw(this.WallOverlayHalfRightFor(leftBlock), Layer.Middle + Layer.OverlayWestAdjustment, leftCenter)
			else if (Blocks.TypeOf(rightBlock) == BlockType.Full)
				this.Camera.Draw(this.WallOverlayHalfLeftFor(rightBlock), Layer.Middle + Layer.OverlayEastAdjustment, rightCenter.add(TerrainDrawer.HalfHeight))
		}
		else if (Blocks.TypeOf(leftBlock) == BlockType.Floor || Blocks.TypeOf(leftBlock) == BlockType.Empty) {
			if (Blocks.TypeOf(rightBlock) == BlockType.Half)
				this.Camera.Draw(this.WallOverlayHalfLeftFor(rightBlock), Layer.Middle + Layer.OverlayEastAdjustment, rightCenter)
			else if (Blocks.TypeOf(rightBlock) == BlockType.Full)
				this.Camera.Draw(this.WallOverlayFullLeftFor(rightBlock), Layer.Middle + Layer.OverlayEastAdjustment, rightCenter)
		}
	}

	private WallOverlayFullRightFor(block: Block) {
		if (!block) return "" // To make it not complain for now
		return "default-wall-overlay-full-right"
	}

	private WallOverlayFullLeftFor(block: Block) {
		if (!block) return ""
		return "default-wall-overlay-full-left"
	}

	private WallOverlayHalfRightFor(block: Block) {
		if (!block) return ""
		return "default-wall-overlay-half-right"
	}

	private WallOverlayHalfLeftFor(block: Block) {
		if (!block) return ""
		return "default-wall-overlay-half-left"
	}

	private drawWallShadows(leftBlock: Block, leftPosition: Vector3, rightPosition: Vector3) {
		const rightBlock = this.Game.terrain.getAt(rightPosition)
		if (!rightBlock)
			return
		const leftCenter = leftPosition.add(TerrainDrawer.BlockCenter)
		const rightCenter = rightPosition.add(TerrainDrawer.BlockCenter)
		const below = new Vector3(0, 0, -1)

		if (Blocks.TypeOf(leftBlock) == BlockType.Full) {
			if (Blocks.TypeOf(rightBlock) == BlockType.Empty && Blocks.TypeOf(this.Game.terrain.getAt(rightPosition.add(below))) == BlockType.Full)
				this.Camera.Draw("default-wall-shadow-full-right", Layer.Bottom + Layer.OverlayWestAdjustment, leftCenter)
			else if (Blocks.TypeOf(rightBlock) == BlockType.Floor)
				this.Camera.Draw("default-wall-shadow-full-right", Layer.Floor + Layer.OverlayWestAdjustment, leftCenter.add(TerrainDrawer.FloorHeight))
			else if (Blocks.TypeOf(rightBlock) == BlockType.Half)
				this.Camera.Draw("default-wall-shadow-half-right", Layer.Middle + Layer.OverlayWestAdjustment, leftCenter.add(TerrainDrawer.HalfHeight))
		}
		else if (Blocks.TypeOf(leftBlock) == BlockType.Half) {
			if (Blocks.TypeOf(rightBlock) == BlockType.Empty && Blocks.TypeOf(this.Game.terrain.getAt(rightPosition.add(below)))== BlockType.Full)
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
		else if (Blocks.TypeOf(leftBlock) == BlockType.Empty && Blocks.TypeOf(this.Game.terrain.getAt(leftPosition.add(below))) == BlockType.Full) {
			if (Blocks.TypeOf(rightBlock) == BlockType.Full)
				this.Camera.Draw("default-wall-shadow-full-left", Layer.Bottom + Layer.OverlayEastAdjustment, rightCenter)
			else if (Blocks.TypeOf(rightBlock) == BlockType.Half)
				this.Camera.Draw("default-wall-shadow-half-left", Layer.Bottom + Layer.OverlayEastAdjustment, rightCenter)
		}
	}

	private variantFor(position: Vector3) {
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

enum Side { Bottom, Top, Left, Right }
