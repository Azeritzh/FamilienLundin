import { GridVector, range, Vector3 } from "@lundin/utility"
import { Box } from "../values/box"
import { FieldRegion, RegionCoordsFor } from "./field-region"

export interface ITerrainManager<Field> {
	WorldBounds: Box | null

	Get(x: number, y: number, z?: number): Field
	Set(x: number, y: number, z: number, field: Field): void
	GetAt(position: Vector3): Field
	SetAt(position: Vector3, field: Field): void
	UpdatedAt(x: number, y: number, z: number): Field

	ApplyUpdatedValues(): void
}

export class TerrainManager<Field, Region extends FieldRegion<Field>> implements ITerrainManager<Field> {
	constructor(
		private RegionSize: GridVector,
		private DefaultBlock: Field,
		private Regions: Map<string, Region>,
		private UpdatedBlocks = new Map<string, Field>(),
		public WorldBounds: Box | null = null, // TODO: do this differently. See also LoadStateLogic
	) { }

	public GetAt(position: Vector3) {
		return this.Get(position.x, position.y, position.z)
	}

	public SetAt(position: Vector3, field: Field) {
		this.Set(position.x, position.y, position.z, field)
	}

	public Get(x: number, y: number, z = 0) {
		x = Math.floor(x)
		y = Math.floor(y)
		z = Math.floor(z)

		if (this.WorldBounds && !this.WorldBounds.ContainsPoint(x, y, z)) {
			const position = this.WorldBounds.Contain(new Vector3(x, y, z))
			x = position.x
			y = position.y
			z = position.z
		}

		const chunk = this.Regions.get(RegionCoordsFor(x, y, z, this.RegionSize).stringify())
		return chunk?.Get(x, y, z)
			?? this.DefaultBlock
	}

	public Set(x: number, y: number, z: number, field: Field) {
		x = Math.floor(x)
		y = Math.floor(y)
		z = Math.floor(z)

		if (this.WorldBounds && !this.WorldBounds.ContainsPoint(x, y, z)) {
			const position = this.WorldBounds.Contain(new Vector3(x, y, z))
			x = position.x
			y = position.y
			z = position.z
		}

		this.UpdatedBlocks.set(Vector3.stringify(x, y, z), field)
	}

	public UpdatedAt(x: number, y: number, z: number) {
		return this.UpdatedBlocks.get(Vector3.stringify(x, y, z)) ?? this.Get(x, y, z)
	}

	public ApplyUpdatedValues() {
		for (const [position, field] of this.UpdatedBlocks)
			this.SetField(Vector3.parse(position), field)
		this.UpdatedBlocks.clear()
	}

	private SetField(position: Vector3, field: Field) {
		const coords = RegionCoordsFor(position.x, position.y, position.z, this.RegionSize).stringify()
		const chunk = this.Regions.get(coords)
		if (chunk)
			chunk.Set(position.x, position.y, position.z, field)
		else
			console.error(`Can't set field outside chunks at (${position.x}, ${position.y}, ${position.z})`)
	}

	public GetCurrent(x: number, y: number, z = 0) {
		x = Math.floor(x)
		y = Math.floor(y)
		z = Math.floor(z)
		return this.UpdatedBlocks.get(Vector3.stringify(x, y, z))
			?? this.Get(x, y, z)
	}

	/** Iterates through all fields, and returns the position and field */
	/*public *AllFields() {
		for (const [coords, region] of this.Regions) {
			const [regionX, regionY, regionZ] = coords.split(",").map(x => +x)
			for (const z of range(0, this.RegionSize.z))
				for (const y of range(0, this.RegionSize.y))
					for (const x of range(0, this.RegionSize.x))
						yield { position: this.getGlobalPosition(x, y, z, regionX, regionY, regionZ), field: region[this.chunkIndexFor(x, y, z)] }
		}
	}*/

	/** Takes a local position and returns the corresponding chunk index */
	private chunkIndexFor(x: number, y: number, z: number) {
		return x + y * this.RegionSize.x + z * this.RegionSize.x * this.RegionSize.y
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
			x + chunkX * this.RegionSize.x,
			y + chunkY * this.RegionSize.y,
			z + chunkZ * this.RegionSize.z,
		)
	}
}
