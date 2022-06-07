import { AgValues, Id } from "./ag-values"

export class BaseChanges<EntityValues extends AgValues> {
	constructor(
		// public readonly terrain: TerrainCollection<Block, BlockValues>,
		public readonly updatedEntityValues: EntityValues,
		public readonly createdEntities: Id[] = [],
		public readonly removedEntities: Id[] = [],
	) { }
}
