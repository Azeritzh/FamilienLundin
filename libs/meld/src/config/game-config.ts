import { TypeId, TypeMap } from "@lundin/age"
import { NonSolidId, SolidId } from "../state/block"
import { BlockValues } from "../state/block-values"
import { GroupedEntityValues } from "../state/entity-values"
import { ItemTypeId, ItemValues } from "../state/item"
import { Constants } from "./constants"
import { Lists } from "./lists"

export class GameConfig {
	constructor(
		public readonly Constants: Constants,
		public readonly Lists: Lists,
		public readonly EntityTypeMap: TypeMap,
		public readonly EntityTypeValues: Map<TypeId, GroupedEntityValues>,
		public readonly SolidTypeMap: TypeMap,
		public readonly SolidTypeValues: Map<SolidId, BlockValues>,
		public readonly NonSolidTypeMap: TypeMap,
		public readonly NonSolidTypeValues: Map<NonSolidId, BlockValues>,
		public readonly ItemTypeMap: TypeMap,
		public readonly ItemValues: Map<ItemTypeId, ItemValues>,
	) { }
	public UpdatesPerSecond = 60
}
