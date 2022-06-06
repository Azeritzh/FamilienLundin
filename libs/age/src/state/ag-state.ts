import { AgValues, Id } from "./ag-values"
import { EntityCollection } from "./entity-collection"
import { TerrainCollection } from "./terrain-collection"
import { TypeMap } from "./type-map"

// The type is a part of the entity id, and this is the mask for it
export const typeMask = 0xFFFF00000000
export const typeOffset = 32 // number of bits to the right of the type

export abstract class AgState<Block, BlockValues extends AgValues, EntityValues extends AgValues> {
	constructor(
		public readonly terrain: TerrainCollection<Block, BlockValues>,
		public readonly entities: EntityCollection<EntityValues>,
		public readonly typeMap: TypeMap,
		public seed = 1,
		public tick = 0,
		public nextId = 1,
		private randomGenerator?: Random,
	) { }

	public typeOf(entity: Id) {
		return entity & typeMask
	}

	public random() {
		if (this.randomGenerator)
			return this.randomGenerator
		const newRandom = new Random(this.tick + this.seed)
		this.randomGenerator = newRandom
		return newRandom
	}

	public finishUpdate() {
		this.entities.applyUpdatedValues()
		this.randomGenerator = null
	}
}

export class Random {
	constructor(private seed: number) { }
	// TODO
}
