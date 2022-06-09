import { Id } from "./base-config"
import { BaseGlobals } from "./base-globals"
import { BaseValues } from "./base-values"
import { TerrainCollection } from "./terrain-collection"

export abstract class BaseState<Globals extends BaseGlobals, Block, BlockValues extends BaseValues, EntityValues extends BaseValues> {
	constructor(
		public readonly globals: Globals,
		public readonly terrain: TerrainCollection<Block, BlockValues>,
		public readonly entityValues: EntityValues,
		public readonly entities: Id[] = [],
		public seed = 1,
		private randomGenerator?: Random,
	) { }

	public random() {
		if (this.randomGenerator)
			return this.randomGenerator
		const newRandom = new Random(this.globals.tick + this.seed)
		this.randomGenerator = newRandom
		return newRandom
	}
}

export class Random {
	constructor(private seed: number) { }
	// TODO
}
