import { Vector3 } from "@lundin/utility"

export class BlockChunk<Field> {
	constructor(
		public Blocks: Field[],
		public ChunkSize = new Vector3(10, 10, 1),
		public Offset: Vector3 = new Vector3(0, 0, 0),
	) { }

	Get(x: number, y: number, z: number) {
		return this.Blocks[this.chunkIndexFor(x - this.Offset.x, y - this.Offset.y, z - this.Offset.z)]
	}

	GetWithoutOffset(x: number, y: number, z: number) {
		return this.Blocks[this.chunkIndexFor(x, y, z)]
	}

	GetAt(position: Vector3) {
		return this.Blocks[this.chunkIndexFor(position.x - this.Offset.x, position.y - this.Offset.y, position.z - this.Offset.z)]
	}

	Set(x: number, y: number, z: number, value: Field) {
		return this.Blocks[this.chunkIndexFor(x - this.Offset.x, y - this.Offset.y, z - this.Offset.z)] = value
	}

	SetWithoutOffset(x: number, y: number, z: number, value: Field) {
		return this.Blocks[this.chunkIndexFor(x, y, z)] = value
	}

	SetAt(position: Vector3, value: Field) {
		return this.Blocks[this.chunkIndexFor(position.x - this.Offset.x, position.y - this.Offset.y, position.z - this.Offset.z)] = value
	}

	private chunkIndexFor(x: number, y: number, z: number) {
		return x + y * this.ChunkSize.x + z * this.ChunkSize.x * this.ChunkSize.y
	}
}
