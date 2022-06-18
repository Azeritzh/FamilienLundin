import { Id, TypeMap } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { MeldConstants } from "./meld-constants"
import { BlockValues } from "./state/block-values"
import { GroupedEntityValues } from "./state/entity-values"

export class MeldConfig {
	constructor(
		public readonly constants: MeldConstants,
		public readonly typeMap: TypeMap,
		public readonly typeValues: Map<Id, GroupedEntityValues>,
		public readonly fieldValues: Map<Id, BlockValues>,
		public readonly chunkSize: Vector3 = { x: 10, y: 10, z: 1 },
	) { }
}
