export class Random {
	constructor(
		private seed: number
	) { }

	SetSeed(seed: number) {
		// TODO
		this.seed = seed
	}

	Generate() {
		return Math.floor(Math.random() * 4294967295) // TODO: make something based on the seed instead
	}

	Int(max: number) {
		return Math.floor(Math.random() * max) // TODO: make something based on the seed instead
	}

	Float(max = 1) {
		return Math.random() * max // TODO: make something based on the seed instead
	}

	In<T>(list: T[]) {
		const index = this.Int(list.length)
		return list[index]
	}
}
