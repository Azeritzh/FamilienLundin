import { Vector3 } from "@lundin/utility"
import { Id } from "./base-config"
import { BaseGlobals } from "./base-globals"
import { BaseValues } from "./base-values"
import { BlockChunk } from "./block-chunk"

export abstract class BaseState<Globals extends BaseGlobals, Block, EntityValues extends BaseValues> {
	constructor(
		public readonly globals: Globals,
		public readonly entityValues: EntityValues,
		public readonly entities: Id[] = [],
		public readonly chunks = new Map<Vector3, BlockChunk<Block>>(),
	) { }
}
