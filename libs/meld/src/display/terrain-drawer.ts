import { Vector3 } from "@lundin/utility"
import { Meld } from "../meld"
import { Block, BlockType } from "../state/block"
import { Camera, Layer } from "./camera"
import { DisplayConfig } from "./display-config"

export class TerrainDrawer {
	static BlockCenter = new Vector3(0.5, 0.5, 0)
	static FloorHeight = new Vector3(0, 0, 1 / 32) // should look like one pixel, so: 1/(WallHeight * PixelsPerTile)
	static HalfHeight = new Vector3(0, 0, 0.5)
	static FullHeight = new Vector3(0, 0, 1)

	constructor(
		private game: Meld,
		private config: DisplayConfig,
		private camera: Camera,
	) { }

	public drawBlockContent(x: number, y: number, z: number) {
		const block = this.game.terrain.get(x, y, z)
		if (!block)
			return
		const position = new Vector3(x, y, z)
		const rightPosition = position.add(this.camera.rightPosition)
		this.drawBlockTile(block, position)
		this.drawBlockWall(block, position)
		this.drawTileOverlays(block, position)
		this.drawWallOverlays(block, position, rightPosition)
	}

	private drawBlockTile(block: Block, position: Vector3) {
		if (block.blockType === BlockType.Empty)
			return
		const solidType = this.game.config.solidTypeMap.typeFor(block.solidType)
		if (solidType == null)
			return

		const layer = this.layerFor(block.blockType)
		const height = this.heightFor(block.blockType)

		this.camera.drawVaried(solidType + "-tile", layer, position.add(height).add(TerrainDrawer.BlockCenter), null, this.variantFor(position))
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
		if (block.blockType === BlockType.Empty || block.blockType === BlockType.Floor)
			return
		const solidType = this.game.config.solidTypeMap.typeFor(block.solidType)
		if (solidType == null)
			return

		if (block.blockType === BlockType.Half)
			this.camera.drawVaried(solidType + "-wall", Layer.Middle - Layer.ZFightingAdjustment, position.add(TerrainDrawer.BlockCenter), null, this.variantFor(position))
		if (block.blockType === BlockType.Full)
			this.camera.drawVaried(solidType + "-wall", Layer.Middle, position.add(TerrainDrawer.BlockCenter), null, this.variantFor(position))
	}

	private drawTileOverlays(block: Block, position: Vector3) {
		const rightPosition = position.add(this.camera.rightPosition)
		const bottomPosition = position.add(this.camera.bottomPosition)
		const rightBlock = this.game.terrain.getAt(rightPosition)
		if (rightBlock)
			this.drawRightLeftTileOverlay(block, position, rightBlock, rightPosition)
		const bottomBlock = this.game.terrain.getAt(bottomPosition)
		if (bottomBlock)
			this.drawTopBottomTileOverlay(block, position, bottomBlock, bottomPosition)
	}

	private drawTopBottomTileOverlay(topBlock: Block, topPosition: Vector3, bottomBlock: Block, bottomPosition: Vector3) {
		if (topBlock.blockType == bottomBlock.blockType)
			return
		if (topBlock.blockType < bottomBlock.blockType)
			this.drawTileOverlay(bottomBlock, Side.Top, bottomPosition)
		else if (topBlock.blockType == BlockType.Floor) // only case with overlay from top block
			this.drawTileOverlay(topBlock, Side.Bottom, topPosition)
	}

	private drawRightLeftTileOverlay(leftBlock: Block, leftPosition: Vector3, rightBlock: Block, rightPosition: Vector3) {
		if (leftBlock.blockType == rightBlock.blockType)
			return
		if (leftBlock.blockType < rightBlock.blockType)
			this.drawTileOverlay(rightBlock, Side.Left, rightPosition)
		else
			this.drawTileOverlay(leftBlock, Side.Right, leftPosition)
	}

	private drawTileOverlay(block: Block, direction: Side, position: Vector3) {
		const blockLayer = this.tileLayerFor(block.blockType)
		const layerAdjustment = this.layerForSide(direction)
		const center = this.heightFor(block.blockType).add(TerrainDrawer.BlockCenter)
		const sprite = this.tileOverlayFor(block, direction)
		this.camera.draw(sprite, blockLayer + layerAdjustment, position.add(center))
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
		const typeName = this.game.config.solidTypeMap.typeFor(block.solidType) ?? ""
		const aber = typeName == "grass" ? "grass" : "default"
		switch (direction) {
			case Side.Bottom: return aber + "-tile-overlay-bottom"
			case Side.Top: return aber + "-tile-overlay-top"
			case Side.Left: return aber + "-tile-overlay-left"
			case Side.Right: return aber + "-tile-overlay-right"
		}
	}

	private drawWallOverlays(leftBlock: Block, leftPosition: Vector3, rightPosition: Vector3) {
		const rightBlock = this.game.terrain.getAt(rightPosition)
		if (!rightBlock)
			return
		const leftCenter = leftPosition.add(TerrainDrawer.BlockCenter)
		const rightCenter = rightPosition.add(TerrainDrawer.BlockCenter)

		if (leftBlock.blockType == BlockType.Full) {
			if (rightBlock.blockType == BlockType.Empty || rightBlock.blockType == BlockType.Floor)
				this.camera.draw(this.WallOverlayFullRightFor(leftBlock), Layer.Middle + Layer.OverlayWestAdjustment, leftCenter)
			else if (rightBlock.blockType == BlockType.Half)
				this.camera.draw(this.WallOverlayHalfRightFor(leftBlock), Layer.Middle + Layer.OverlayWestAdjustment, leftCenter.add(TerrainDrawer.HalfHeight))
		}
		else if (leftBlock.blockType == BlockType.Half) {
			if (rightBlock.blockType == BlockType.Empty || rightBlock.blockType == BlockType.Floor)
				this.camera.draw(this.WallOverlayHalfRightFor(leftBlock), Layer.Middle + Layer.OverlayWestAdjustment, leftCenter)
			else if (rightBlock.blockType == BlockType.Full)
				this.camera.draw(this.WallOverlayHalfLeftFor(rightBlock), Layer.Middle + Layer.OverlayEastAdjustment, rightCenter.add(TerrainDrawer.HalfHeight))
		}
		else if (leftBlock.blockType == BlockType.Floor || leftBlock.blockType == BlockType.Empty) {
			if (rightBlock.blockType == BlockType.Half)
				this.camera.draw(this.WallOverlayHalfLeftFor(rightBlock), Layer.Middle + Layer.OverlayEastAdjustment, rightCenter)
			else if (rightBlock.blockType == BlockType.Full)
				this.camera.draw(this.WallOverlayFullLeftFor(rightBlock), Layer.Middle + Layer.OverlayEastAdjustment, rightCenter)
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
