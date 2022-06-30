import { Vector3 } from "@lundin/utility"
import { Meld } from "../meld"
import { Block, BlockType } from "../state/block"
import { Camera } from "./camera"
import { DisplayConfig } from "./display-config"

export class TerrainDrawer {
	constructor(
		private game: Meld,
		private config: DisplayConfig,
		private camera: Camera,
	) { }

	public drawBlockContent(x: number, y: number, z: number) {
		const block = this.game.terrain.get(x, y, z)
		if (!block)
			return
		if (block.blockType == BlockType.Empty)
			this.drawEmpty() // (block, x, y, z)
		else if (block.blockType == BlockType.Half)
			this.drawHalfWall(block, x, y, z)
		else if (block.blockType == BlockType.Full)
			this.drawFullWall(block, x, y, z)
	}

	public drawBlockBottom(x: number, y: number, z: number) {
		const block = this.game.terrain.get(x, y, z)
		if (!block)
			return
		if (block.blockType == BlockType.Floor)
			this.drawFloor(block, x, y, z)
	}

	private drawEmpty() { //block: Block, x: number, y: number, z: number) {
		return
	}

	private drawFloor(block: Block, x: number, y: number, z: number) {
		const blockType = this.game.config.blockTypeMap.typeFor(block.solidType)
		if (blockType == null)
			return
		this.drawBlockTop(blockType, new Vector3(x, y, z))
	}

	private drawHalfWall(block: Block, x: number, y: number, z: number) {
		const blockType = this.game.config.blockTypeMap.typeFor(block.solidType)
		if (blockType == null)
			return
		this.drawBlockTop(blockType, new Vector3(x, y, z + 0.5))
	}

	private drawFullWall(block: Block, x: number, y: number, z: number) {
		const blockType = this.game.config.blockTypeMap.typeFor(block.solidType)
		if (blockType == null)
			return
		this.drawBlockFullSide(blockType, new Vector3(x, y, z + this.fullWallOffset()))
		this.drawBlockTop(blockType, new Vector3(x, y, z + 1))
	}

	private drawBlockTop(blockType: string, position: Vector3) { //, variant: number) {
		this.camera.drawVaried(blockType + "-tile", position) // , null, variant)
	}

	private drawBlockFullSide(blockType: string, position: Vector3) { //, variant: number) {
		this.camera.drawVaried(blockType + "-wall", position) // , null, variant)
	}

	private fullWallOffset(): number {
		return (this.config.wallDisplayHeight - 1) / this.config.wallDisplayHeight
	}
}
