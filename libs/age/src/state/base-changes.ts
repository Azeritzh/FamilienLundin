import { Id } from "./base-config"
import { BaseValues } from "./base-values"

export class BaseChanges<EntityValues extends BaseValues> {
	constructor(
		// public readonly terrain: TerrainCollection<Block, BlockValues>,
		public readonly updatedEntityValues: EntityValues,
		public readonly createdEntities: Id[] = [],
		public readonly removedEntities: Id[] = [],
	) { }
}
