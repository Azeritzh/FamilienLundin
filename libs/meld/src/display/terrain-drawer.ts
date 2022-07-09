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
		this.drawBlockTile(block, position)
		this.drawBlockWall(block, position)
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
