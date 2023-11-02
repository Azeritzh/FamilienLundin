import { GridVector, Vector3 } from "@lundin/utility"
import { BlockChunk } from "./block-chunk"

export function RegionCoordsFor(x: number, y: number, z: number, regionSize: GridVector): GridVector {
	// centering region (0,0,0) on block (0,0,0)
	const translatedX = x + regionSize.X / 2
	const translatedY = y + regionSize.Y / 2
	const translatedZ = z + regionSize.Z / 2
	return new Vector3(
		Math.floor(translatedX / regionSize.X),
		Math.floor(translatedY / regionSize.Y),
		Math.floor(translatedZ / regionSize.Z)
	)
}

export class FieldRegion<Field> {
	constructor(
		public Size: GridVector,
		public ChunkSize: GridVector,
		public Offset: GridVector,
		public Chunks: BlockChunk<Field>[],
	) { }

	public Get(x: number, y: number, z: number): Field {
		return this.Chunks[this.IndexFor(x, y, z)].Get(x, y, z)
	}

	public Set(x: number, y: number, z: number, value: Field): void {
		this.Chunks[this.IndexFor(x, y, z)].Set(x, y, z, value)
	}

	public GetByVector(position: GridVector): Field {
		return this.Get(position.X, position.Y, position.Z)
	}

	public SetByVector(position: GridVector, value: Field): void {
		this.Set(position.X, position.Y, position.Z, value)
	}

	public IndexFor(x: number, y: number, z: number): number {
		const xSizeInChunks = Math.floor(this.Size.X / this.ChunkSize.X)
		const ySizeInChunks = Math.floor(this.Size.Y / this.ChunkSize.Y)
		const chunkX = Math.floor((x - this.Offset.X) / this.ChunkSize.X) // TODO: floor or trunc?
		const chunkY = Math.floor((y - this.Offset.Y) / this.ChunkSize.Y)
		const chunkZ = Math.floor((z - this.Offset.Z) / this.ChunkSize.Z)
		return chunkX + chunkY * xSizeInChunks + chunkZ * xSizeInChunks * ySizeInChunks
	}

	public Contains(x: number,  y: number, z: number) {
		const Offset = this.Offset
		const Size = this.Size
		return Offset.X <= x && x < (Offset.X + Size.X)
			&& Offset.Y <= y && y < (Offset.Y + Size.Y)
			&& Offset.Z <= z && z < (Offset.Z + Size.Z)
	}
}
