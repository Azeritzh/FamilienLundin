export class Random {
	constructor(
		private getSeed: () => number,
		private previousSeed = -1,
		private generator = new RandomGenerator(-1)
	) { }

	get get() {
		const seed = this.getSeed()
		if (this.previousSeed === seed)
			return this.generator
		this.previousSeed = seed
		this.generator = new RandomGenerator(seed)
		return this.generator
	}
}

class RandomGenerator {
	constructor(private seed: number) { }

	int(max: number) {
		return Math.floor(Math.random() * max) // TODO: make something based on the seed instead
	}

	float(max: number) {
		return Math.random() * max // TODO: make something based on the seed instead
	}

	in<T>(list: T[]) {
		const index = this.int(list.length)
		return list[index]
	}
}
