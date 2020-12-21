export class VirusConfig {
	constructor(
		public playerCount = 2,
		public width = 8,
		public height = 8,
	) { }

	initialPositions(x: number, y: number) {
		if (x === 0 && y === 0)
			return this.topLeftPlayer()
		if (x === this.width - 1 && y === 0)
			return this.topRightPlayer()
		if (x === 0 && y === this.height - 1)
			return this.bottomLeftPlayer()
		if (x === this.width - 1 && y === this.height - 1)
			return this.bottomRightPlayer()
		return 0
	}

	private topLeftPlayer() {
		return 1
	}

	private topRightPlayer() {
		return 2
	}

	private bottomLeftPlayer() {
		switch (this.playerCount) {
			case 2: return 2
			case 3: return 3
			case 4: return 3
		}
	}

	private bottomRightPlayer() {
		switch (this.playerCount) {
			case 2: return 1
			case 3: return 0
			case 4: return 4
		}
	}

	findWinner() {
		return null
	}
}
