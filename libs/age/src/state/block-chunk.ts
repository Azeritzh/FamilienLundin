import { Vector3 } from "@lundin/utility"
import { GameGrid3d } from "./game-grid-3d"

export class BlockChunk<Block> {
	constructor(
		public blocks: GameGrid3d<Block>,
		public offset: Vector3 = { x: 0, y: 0, z: 0 },
	) { }

	get(x: number, y: number, z: number) {
		return this.blocks.get(x - this.offset.x, y - this.offset.y, z - this.offset.z)
	}

	set(x: number, y: number, z: number, block: Block) {
		return this.blocks.set(x - this.offset.x, y - this.offset.y, z - this.offset.z, block)
	}
}
