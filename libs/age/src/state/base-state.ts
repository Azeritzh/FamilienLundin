import { Id } from "./base-config"
import { BaseValues } from "./base-values"
import { TerrainCollection } from "./terrain-collection"

export abstract class BaseState<Block, BlockValues extends BaseValues, EntityValues extends BaseValues> {
	constructor(
		public readonly terrain: TerrainCollection<Block, BlockValues>,
		public readonly entityValues: EntityValues,
		public readonly entities: Id[] = [],
		public seed = 1,
		public tick = 0,
		public nextId = 1,
		private randomGenerator?: Random,
	) { }

	public random() {
		if (this.randomGenerator)
			return this.randomGenerator
		const newRandom = new Random(this.tick + this.seed)
		this.randomGenerator = newRandom
		return newRandom
	}
}

export class Random {
	constructor(private seed: number) { }
	// TODO
}
