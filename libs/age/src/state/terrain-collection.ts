import { Vector3 } from "@lundin/utility"
import { AgValues } from "./ag-values"
import { BlockChunk } from "./block-chunk"

export class TerrainCollection<Block, BlockValues extends AgValues> {
	constructor(
		private readonly defaultBlock: Block,
		public readonly blockValues: BlockValues,
		public chunkSize: Vector3 = { x: 10, y: 10, z: 10 },
		public readonly chunks = new Map<Vector3, BlockChunk<Block>>(), // Problem: Vector3 isn't a struct in js
	) { }

	getFromPosition(position: Vector3) {
		return this.get(position.x, position.y, position.z)
	}

	get(x: number, y: number, z: number) {
		x = Math.floor(x)
		y = Math.floor(y)
		z = Math.floor(z)
		const chunkX = this.chunkCoord(x, this.chunkSize.x)
		const chunkY = this.chunkCoord(y, this.chunkSize.y)
		const chunkZ = this.chunkCoord(z, this.chunkSize.z)
		const chunk = this.chunks.get({ x: chunkX, y: chunkY, z: chunkZ })
		if (chunk)
			return chunk.get(x, y, z)
		return this.defaultBlock
	}

	chunkCoord(n: number, size: number) {
		return Math.floor(n / size)
	}
}