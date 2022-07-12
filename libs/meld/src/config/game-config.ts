import { TypeId, TypeMap } from "@lundin/age"
import { NonSolidId, SolidId } from "../state/block"
import { BlockValues } from "../state/block-values"
import { GroupedEntityValues } from "../state/entity-values"
import { Constants } from "./constants"

export class GameConfig {
	constructor(
		public readonly constants: Constants,
		public readonly entityTypeMap: TypeMap,
		public readonly entityTypeValues: Map<TypeId, GroupedEntityValues>,
		public readonly solidTypeMap: TypeMap,
		public readonly solidTypeValues: Map<SolidId, BlockValues>,
		public readonly nonSolidTypeMap: TypeMap,
		public readonly nonSolidTypeValues: Map<NonSolidId, BlockValues>,
	) { }
}
