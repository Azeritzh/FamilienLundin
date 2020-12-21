export class GameGrid<T> {
	private grid: T[]

	constructor(
		public width: number,
		public height: number,
		initialise: (x: number, y: number) => T = () => null,
	) {
		this.setAll(initialise)
	}

	setAll(callback: (x: number, y: number) => T){
		this.grid = []
		for (let y = 0; y < this.height; y++)
			for (let x = 0; x < this.width; x++)
				this.grid.push(callback(x, y))
	}

	get(x: number, y: number) {
		return this.grid[x + y * this.width]
	}

	set(x: number, y: number, item: T) {
		this.grid[x + y * this.width] = item
	}
}
