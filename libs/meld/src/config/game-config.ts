import { EntityTypeOffset, TypeId, TypeMap } from "@lundin/age"
import { NonSolidId, NonSolidOffset, SolidId, SolidOffset } from "../state/block"
import { BlockValues } from "../state/block-values"
import { GroupedEntityValues, GroupedEntityValuesFrom } from "../state/entity-values"
import { ItemTypeId, ItemValues, ItemValuesFrom } from "../state/item"
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

	static From(deserialised: any) {
		const entityTypeNames = Object.keys(deserialised.EntityTypes)
		const entityTypeMap = TypeMap.From(EntityTypeOffset, entityTypeNames)
		const solidTypeNames = Object.keys(deserialised.SolidTypes)
		const solidTypeMap = TypeMap.From(SolidOffset, solidTypeNames)
		const nonSolidTypeNames = Object.keys(deserialised.NonSolidTypes)
		const nonSolidTypeMap = TypeMap.From(NonSolidOffset, nonSolidTypeNames)
		const itemTypeNames = Object.keys(deserialised.ItemTypes)
		const itemTypeMap = TypeMap.From(NonSolidOffset, itemTypeNames)
		return new GameConfig(
			Constants.From(deserialised.Constants, entityTypeMap, itemTypeMap, solidTypeMap, nonSolidTypeMap),
			Lists.From(deserialised.Lists, entityTypeMap),
			entityTypeMap,
			new Map(entityTypeNames.map(x => [entityTypeMap.TypeIdFor(x), GroupedEntityValuesFrom(deserialised.EntityTypes[x])])),
			solidTypeMap,
			new Map(solidTypeNames.map(x => [solidTypeMap.TypeIdFor(x), { Hardness: 0 }])),
			nonSolidTypeMap,
			new Map(nonSolidTypeNames.map(x => [nonSolidTypeMap.TypeIdFor(x), { Hardness: 0 }])),
			itemTypeMap,
			new Map(itemTypeNames.map(x => [itemTypeMap.TypeIdFor(x), ItemValuesFrom(deserialised.ItemTypes[x])])),
		)
	}
}
