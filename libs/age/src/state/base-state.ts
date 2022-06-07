import { AgValues, Id } from "./ag-values"
import { TerrainCollection } from "./terrain-collection"

// The type is a part of the entity id, and this is the mask for it
export const typeMask = 0xFF000000
export const typeOffset = 24 // number of bits to the right of the type

export abstract class BaseState<Block, BlockValues extends AgValues, EntityValues extends AgValues> {
	constructor(
		public readonly terrain: TerrainCollection<Block, BlockValues>,
		public readonly entityValues: EntityValues,
		public readonly entities: Id[] = [],
		public seed = 1,
		public tick = 0,
		public nextId = 1,
		private randomGenerator?: Random,
	) { }

	public static typeOf(entity: Id) {
		return entity & typeMask
	}

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
