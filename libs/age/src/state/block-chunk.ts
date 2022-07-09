import { Vector3 } from "@lundin/utility"

export class BlockChunk<Field> {
	constructor(
		public blocks: Field[],
		public chunkSize = new Vector3(10, 10, 1),
		public offset: Vector3 = new Vector3(0, 0, 0),
	) { }

	get(x: number, y: number, z: number) {
		return this.blocks[this.chunkIndexFor(x - this.offset.x, y - this.offset.y, z - this.offset.z)]
	}

	set(x: number, y: number, z: number, value: Field) {
		return this.blocks[this.chunkIndexFor(x - this.offset.x, y - this.offset.y, z - this.offset.z)] = value
	}

	private chunkIndexFor(x: number, y: number, z: number) {
		return x + y * this.chunkSize.x + z * this.chunkSize.x * this.chunkSize.y
	}
}
