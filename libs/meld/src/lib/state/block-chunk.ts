import { Vector3 } from "@lundin/utility"
import { Block } from "./block"

export class BlockChunk {
	constructor(
		public Blocks: Block[][][],
		public Offset: Vector3 = { x: 0, y: 0, z: 0 },
	) { }

	get(x: number, y: number, z: number) {
		return this.Blocks[x - this.Offset.x, y - this.Offset.y, z - this.Offset.z]
	}
}
