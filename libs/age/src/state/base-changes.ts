import { Vector3 } from "@lundin/utility"
import { Id } from "./base-config"
import { BaseValues } from "./base-values"

export class BaseChanges<EntityValues extends BaseValues, Block> {
	constructor(
		// public readonly terrain: TerrainCollection<Block, BlockValues>,
		public readonly updatedEntityValues: EntityValues,
		public readonly createdEntities: Id[] = [],
		public readonly removedEntities: Id[] = [],
		public readonly updatedBlocks = new Map<Vector3, Block>(),
	) { }
}
