import { Id, TypeMap } from "@lundin/age"
import { BlockValues } from "../state/block-values"
import { GroupedEntityValues } from "../state/entity-values"
import { Constants } from "./constants"

export class GameConfig {
	constructor(
		public readonly constants: Constants,
		public readonly entityTypeMap: TypeMap,
		public readonly entityTypeValues: Map<Id, GroupedEntityValues>,
		public readonly solidTypeMap: TypeMap,
		public readonly solidTypeValues: Map<Id, BlockValues>,
		public readonly nonSolidTypeMap: TypeMap,
		public readonly nonSolidTypeValues: Map<Id, BlockValues>,
	) { }
}
