import { range, Vector3 } from "@lundin/utility"
import { BaseChanges } from "./base-changes"
import { BaseConfig } from "./base-config"
import { BaseState } from "./base-state"

export class TerrainManager<Field, FieldValues> {
	constructor(
		private config: BaseConfig<FieldValues, any, any>,
		private state: BaseState<any, Field, any>,
		private changes: BaseChanges<any, Field>,
	) { }

	public addChunk(fields: Field[], x: number, y: number, z = 0) {
		this.state.chunks.set({ x, y, z }, fields)
	}

	public get(x: number, y: number, z = 0) {
		x = Math.floor(x)
		y = Math.floor(y)
		z = Math.floor(z)
		const { chunkCoords, index } = this.getChunkPositionFor(x, y, z)
		const chunk = this.state.chunks.get(chunkCoords)
		if (!chunk)
			console.warn("Trying to access outside any chunk")
		return chunk?.[index]
		// ?? this.defaultTile
	}

	/** Takes a global position and returns the corresponding chunk coordinate and index within that chunk */
	private getChunkPositionFor(x: number, y: number, z: number) {
		const chunkCoords = this.getChunkCoords(x, y, z)
		const index = this.chunkIndexFor(
			x - chunkCoords.x * this.config.chunkSize.x,
			y - chunkCoords.y * this.config.chunkSize.y,
			z - chunkCoords.z * this.config.chunkSize.z
		)
		return { chunkCoords, index }
	}

	private getChunkCoords(x: number, y: number, z: number): Vector3 {
		return {
			x: this.chunkCoord(x, this.config.chunkSize.x),
			y: this.chunkCoord(y, this.config.chunkSize.y),
			z: this.chunkCoord(z, this.config.chunkSize.z),
		}
	}

	private chunkCoord(n: number, size: number) {
		return Math.floor(n / size)
	}

	/** Takes a local position and returns the corresponding chunk index */
	private chunkIndexFor(x: number, y: number, z: number) {
		return x + y * this.config.chunkSize.x + z * this.config.chunkSize.x * this.config.chunkSize.y
	}

	public getCurrent(x: number, y: number, z = 0) {
		x = Math.floor(x)
		y = Math.floor(y)
		z = Math.floor(z)
		return this.changes.updatedBlocks.get({ x, y, z })
			?? this.get(x, y, z)
	}

	/** Iterates through all fields in a chunk, and returns the local position and field */
	public *allFields(chunkCoords = { x: 0, y: 0, z: 0 }) {
		const chunk = this.state.chunks.get(chunkCoords)
		for (const z of range(0, this.config.chunkSize.z))
			for (const y of range(0, this.config.chunkSize.y))
				for (const x of range(0, this.config.chunkSize.x))
					yield { x, y, z, field: chunk[this.chunkIndexFor(x, y, z)] }
	}

	public fieldsAround(x: number, y: number, z = 0) {
		return this.fieldsWithinRadius(x, y, z, 1, 1, 0)
	}

	public *fieldsWithinRadius(x: number, y: number, z: number, radiusX = 1, radiusY = 1, radiusZ = 1) {
		for (const i of range(x - radiusX, x + radiusX + 1))
			for (const j of range(y - radiusY, y + radiusY + 1))
				for (const k of range(z - radiusZ, z + radiusZ + 1))
					//if (this.isWithinBounds(i, j, k))
					yield { i, j, k, field: this.get(i, j, k) }
	}

	public set(field: Field, x: number, y: number, z = 0) {
		x = Math.floor(x)
		y = Math.floor(y)
		z = Math.floor(z)
		this.changes.updatedBlocks.set({ x, y, z }, field)
	}

	public applyUpdatedValues() {
		for (const [{ x, y, z }, field] of this.changes.updatedBlocks)
			this.setField(x, y, z, field)
		this.changes.updatedBlocks.clear()
	}

	private setField(x: number, y: number, z: number, field: Field) {
		const { chunkCoords, index } = this.getChunkPositionFor(x, y, z)
		const chunk = this.state.chunks.get(chunkCoords)
		if (chunk)
			chunk[index] = field
		else
			console.error("Can't set field outside chunks at ({0}, {1}, {2})", x, y, z)
	}
}
