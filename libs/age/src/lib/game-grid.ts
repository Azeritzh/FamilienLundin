import { range } from "@lundin/utility"

export class GameGrid<T> {
	private grid: T[]

	constructor(
		public readonly width: number,
		public readonly height: number,
		initialise: (x: number, y: number) => T = () => null,
	) {
		this.setAll(initialise)
	}

	setAll(callback: (x: number, y: number) => T) {
		this.grid = []
		for (const { x, y } of this.allFields())
			this.grid.push(callback(x, y))
	}

	*allFields() {
		for (const y of range(0, this.height))
			for (const x of range(0, this.width))
				yield { x, y, field: this.get(x, y) }
	}

	*fieldsAround(x: number, y: number, radius = 1) {
		for (const i of range(x - radius, x + radius + 1))
			for (const j of range(y - radius, y + radius + 1))
				if (this.isWithinBounds(i, j))
					yield { i, j, field: this.get(i, j) }
	}

	get(x: number, y: number) {
		return this.grid[this.indexFor(x, y)]
	}

	set(x: number, y: number, item: T) {
		this.grid[this.indexFor(x, y)] = item
	}

	isWithinBounds(x: number, y: number) {
		return 0 <= x && x < this.width
			&& 0 <= y && y < this.height
	}

	private indexFor(x: number, y: number) {
		return x + y * this.width
	}
}
