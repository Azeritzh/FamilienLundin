import { range, Vector3 } from "@lundin/utility"
import { BlockChunk } from "./block-chunk"

export class TerrainManager<Field> {
	constructor(
		private chunkSize = new Vector3(10, 10, 1),
		private chunks: Map<string, BlockChunk<Field>>,
		private updatedBlocks = new Map<string, Field>(),
	) { }

	public AddChunk(x: number, y: number, z: number) {
		const offset = new Vector3(this.chunkSize.x * x, this.chunkSize.y * y, this.chunkSize.z * z)
		this.chunks.set(Vector3.stringify(x, y, z), new BlockChunk([], this.chunkSize, offset))
	}

	public Get(x: number, y: number, z = 0) {
		x = Math.floor(x)
		y = Math.floor(y)
		z = Math.floor(z)
		const chunk = this.chunks.get(this.getChunkCoords(x, y, z))
		return chunk?.Get(x, y, z)
		// ?? this.defaultTile
	}

	public GetAt(position: Vector3) {
		return this.Get(position.x, position.y, position.z)
	}

	/** Takes a global position and returns the corresponding chunk coordinate */
	private getChunkCoords(x: number, y: number, z: number) {
		return Vector3.stringify(
			this.chunkCoord(x, this.chunkSize.x),
			this.chunkCoord(y, this.chunkSize.y),
			this.chunkCoord(z, this.chunkSize.z),
		)
	}

	private chunkCoord(n: number, size: number) {
		return Math.floor(n / size)
	}

	/** Takes a local position and returns the corresponding chunk index */
	private chunkIndexFor(x: number, y: number, z: number) {
		return x + y * this.chunkSize.x + z * this.chunkSize.x * this.chunkSize.y
	}

	public GetCurrent(x: number, y: number, z = 0) {
		x = Math.floor(x)
		y = Math.floor(y)
		z = Math.floor(z)
		return this.updatedBlocks.get(Vector3.stringify(x, y, z))
			?? this.Get(x, y, z)
	}

	/** Iterates through all fields, and returns the position and field */
	public *AllFields() {
		for (const [coords, chunk] of this.chunks) {
			const [chunkX, chunkY, chunkZ] = coords.split(",").map(x => +x)
			for (const z of range(0, this.chunkSize.z))
				for (const y of range(0, this.chunkSize.y))
					for (const x of range(0, this.chunkSize.x))
						yield { position: this.getGlobalPosition(x, y, z, chunkX, chunkY, chunkZ), field: chunk[this.chunkIndexFor(x, y, z)] }
		}
	}

	/** Iterates through all fields in a chunk, and returns the local (and global) position and field */
	public *AllFieldsInChunk(chunkX = 0, chunkY = 0, chunkZ = 0) {
		const chunk = this.chunks.get(Vector3.stringify(chunkX, chunkY, chunkZ))
		if (!chunk)
			return // TODO: should there be notification or something here?
		for (const z of range(0, this.chunkSize.z))
			for (const y of range(0, this.chunkSize.y))
				for (const x of range(0, this.chunkSize.x))
					yield { global: this.getGlobalPosition(x, y, z, chunkX, chunkY, chunkZ), x, y, z, field: chunk[this.chunkIndexFor(x, y, z)] }
	}

	public FieldsAround(x: number, y: number, z = 0) {
		return this.FieldsWithinRadius(x, y, z, 1, 1, 0)
	}

	public *FieldsWithinRadius(x: number, y: number, z: number, radiusX = 1, radiusY = 1, radiusZ = 1) {
		for (const i of range(x - radiusX, x + radiusX + 1))
			for (const j of range(y - radiusY, y + radiusY + 1))
				for (const k of range(z - radiusZ, z + radiusZ + 1))
					//if (this.isWithinBounds(i, j, k))
					yield { i, j, k, field: this.Get(i, j, k) }
	}

	private getGlobalPosition(x: number, y: number, z: number, chunkX: number, chunkY: number, chunkZ = 0): Vector3 {
		return new Vector3(
			x + chunkX * this.chunkSize.x,
			y + chunkY * this.chunkSize.y,
			z + chunkZ * this.chunkSize.z,
		)
	}

	public Set(field: Field, x: number, y: number, z = 0) {
		x = Math.floor(x)
		y = Math.floor(y)
		z = Math.floor(z)
		this.updatedBlocks.set(Vector3.stringify(x, y, z), field)
	}

	public SetAt(position: Vector3, field: Field) {
		const pos = Vector3.stringify(Math.floor(position.x), Math.floor(position.y), Math.floor(position.z))
		this.updatedBlocks.set(pos, field)
	}

	public ApplyUpdatedValues() {
		for (const [position, field] of this.updatedBlocks)
			this.setField(Vector3.parse(position), field)
		this.updatedBlocks.clear()
	}

	private setField(position: Vector3, field: Field) {
		const chunk = this.chunks.get(this.getChunkCoords(position.x, position.y, position.z))
		if (chunk)
			chunk.Set(position.x, position.y, position.z, field)
		else
			console.error(`Can't set field outside chunks at (${position.x}, ${position.y}, ${position.z})`)
	}
}
