import { Vector3 } from "@lundin/utility"
import { Block } from "./block"
import { BlockChunk } from "./block-chunk"
import { NonSolidBlockValues } from "./non-solid-block-values"
import { SolidBlockValues } from "./solid-block-values"

export class TerrainCollection {
	constructor(
		public chunkSize: Vector3 = { x: 100, y: 100, z: 10 },
		public readonly chunks = new Map<Vector3, BlockChunk>(), // Problem: Vector3 isn't a struct in js
		public readonly solidBlockValues = new SolidBlockValues<number>(),
		public readonly nonSolidBlockValues = new NonSolidBlockValues<number>(),
		// TODO: BlockDecoration Collection
		// TODO: TileEntity Collection
		// TODO: Temperature Collection
		private readonly defaultBlock = Block.newEmpty(0),
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