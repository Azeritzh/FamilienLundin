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

	drawBlocks() {
		for (const { position, field } of this.game.terrain.allFields())
			this.drawBlock(position, field)
	}


	private drawBlock(position: Vector3, block: Block) {
		if (position.z !== 0)
			return
		const sprite = this.game.config.blockTypeMap.typeFor(block.solidType) ?? "obstacle"
		this.camera.draw(sprite, position)
	}

	public drawBlockContent(x: number, y: number, z: number) {
		const block = this.game.terrain.get(x, y, z)
		if (block.blockType == BlockType.Empty)
			this.drawEmpty(block, x, y, z)
		else if (block.blockType == BlockType.Half)
			this.drawHalfWall(block, x, y, z)
		else if (block.blockType == BlockType.Full)
			this.drawFullWall(block, x, y, z)
	}

	public drawBlockBottom(x: number, y: number, z: number) {
		const block = this.game.terrain.get(x, y, z)
		if (block.blockType == BlockType.Floor)
			this.drawFloor(block, x, y, z)
	}

	private drawEmpty(block: Block, x: number, y: number, z: number) {
		return
	}

	private drawFloor(block: Block, x: number, y: number, z: number) {
		const blockType = this.game.config.blockTypeMap.typeFor(block.solidType)
		if (blockType == null)
			return
		const random = this.RandomFor(x, y, z)
		this.drawBlockTop(blockType, new Vector3(x, y, z), random)
	}

	private drawHalfWall(block: Block, x: number, y: number, z: number) {
		const blockType = this.game.config.blockTypeMap.typeFor(block.solidType)
		if (blockType == null)
			return
		const random = this.RandomFor(x, y, z);
		this.drawBlockTop(blockType, new Vector3(x, y, z + 0.5), random)
	}

	private drawFullWall(block: Block, x: number, y: number, z: number) {
		const blockType = this.game.config.blockTypeMap.typeFor(block.solidType)
		if (blockType == null)
			return
		const random = this.RandomFor(x, y, z)
		this.drawBlockFullSide(blockType, new Vector3(x, y, z + this.fullWallOffset()), random)
		this.drawBlockTop(blockType, new Vector3(x, y, z + 1), random)
	}

	private drawBlockTop(blockType: string, position: Vector3, random: number) {
		this.camera.draw(blockType, position)
		/*DisplayProvider.Draw(
			SpriteType.BlockTop,
			blockType,
			Camera.ScreenPositionFor(position),
			(int)State.Tick,
			random);*/
	}

	private drawBlockFullSide(blockType: string, position: Vector3, random: number) {
		this.camera.draw(blockType, position)
		/*DisplayProvider.Draw(
			SpriteType.BlockFullSide,
			blockType,
			Camera.ScreenPositionFor(position),
			(int)State.Tick,
			random);*/
	}

	private fullWallOffset(): number {
		return (this.config.wallDisplayHeight - 1) / this.config.wallDisplayHeight
	}

	private RandomFor(x: number, y: number, z: number): number {
		return 1
		/*if (x == 0)
			x = 1234;
		if (y == 0)
			y = 1234;
		if (z == 0)
			z = 1234;
		var number = (x / 13f + y / 31f + z / 71f) * 345;
		return (int)(10000 * (number - Math.Floor(number)));*/
	}
}
