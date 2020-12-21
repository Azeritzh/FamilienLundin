export class GameGrid<T> {
	private grid: T[]

	constructor(
		public width: number,
		public height: number,
		initialise: (x: number, y: number) => T = () => null,
	) {
		this.setAll(initialise)
	}

	setAll(callback: (x: number, y: number) => T) {
		this.grid = []
		this.forAll((x, y) => {
			this.grid.push(callback(x, y))
		})
	}

	forAll(callback: (x: number, y: number, item: T) => void | true) {
		for (let y = 0; y < this.height; y++)
			for (let x = 0; x < this.width; x++)
				if (callback(x, y, this.get(x, y)))
					return
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
