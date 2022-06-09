import { BaseGlobals } from "../state/base-globals"

export class Random {
	constructor(
		private globals: BaseGlobals,
		private previousTick = -1,
		private generator = new RandomGenerator(-1)
	) { }

	get get() {
		if (this.previousTick === this.globals.tick)
			return this.generator
		this.previousTick = this.globals.tick
		this.generator = new RandomGenerator(this.globals.seed + this.globals.tick)
		return this.generator
	}
}

class RandomGenerator {
	constructor(private seed: number) { }
	
	int(max: number) {
		return Math.floor(Math.random() * max) // TODO: make something based on the seed instead
	}
}
