import { range } from "@lundin/utility"

export class GameGrid3d<T> {
	private grid: T[]

	constructor(
		public readonly xSize: number,
		public readonly ySize: number,
		public readonly zSize: number,
		initialise: (x: number, y: number, z: number) => T = () => null,
	) {
		this.setAll(initialise)
	}

	setAll(callback: (x: number, y: number, z: number) => T) {
		this.grid = []
		for (const { x, y, z } of this.allFields())
			this.grid.push(callback(x, y, z))
	}

	*allFields() {
		for (const z of range(0, this.zSize))
			for (const y of range(0, this.ySize))
				for (const x of range(0, this.xSize))
					yield { x, y, z, field: this.get(x, y, z) }
	}

	*fieldsAround(x: number, y: number, z: number, radius = 1) {
		for (const i of range(x - radius, x + radius + 1))
			for (const j of range(y - radius, y + radius + 1))
				for (const k of range(z - radius, z + radius + 1))
					if (this.isWithinBounds(i, j, k))
						yield { i, j, field: this.get(i, j, k) }
	}

	get(x: number, y: number, z: number) {
		return this.grid[this.indexFor(x, y, z)]
	}

	set(x: number, y: number, z: number, item: T) {
		this.grid[this.indexFor(x, y, z)] = item
	}

	isWithinBounds(x: number, y: number, z: number) {
		return 0 <= x && x < this.xSize
			&& 0 <= y && y < this.ySize
			&& 0 <= z && z < this.zSize
	}

	private indexFor(x: number, y: number, z: number) {
		return x + y * this.xSize + z * this.xSize * this.ySize
	}
}
