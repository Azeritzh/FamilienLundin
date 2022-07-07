import { Block } from "./block"
import { EntityValues } from "./entity-values"

export class Changes {
	constructor(
		public readonly updatedEntityValues: EntityValues,
		public readonly updatedBlocks = new Map<string, Block>(),
	) { }
}
