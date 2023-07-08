import { Block } from "./block"
import { EntityValues } from "./entity-values"

export class Changes {
	constructor(
		public readonly EntityValues: EntityValues,
		public readonly UpdatedBlocks = new Map<string, Block>(),
	) { }
}
