import { Id, RectangularSize, TypeMap } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Constants } from "./constants"
import { BlockValues } from "../state/block-values"
import { GroupedEntityValues } from "../state/entity-values"
import { updatesPerSecond } from "../meld-game"

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

	public static read(jsonConfig: any) {
		const entityTypeNames = Object.keys(jsonConfig.entityTypes)
		const entityTypeMap = TypeMap.from(entityTypeNames)
		const solidTypeNames = Object.keys(jsonConfig.blockTypes)
		const solidTypeMap = TypeMap.from(solidTypeNames)
		const nonSolidTypeNames = Object.keys(jsonConfig.blockTypes)
		const nonSolidTypeMap = TypeMap.from(nonSolidTypeNames)
		return new GameConfig(
			constantsFrom(jsonConfig.constants, entityTypeMap),
			entityTypeMap,
			new Map(entityTypeNames.map(x => [entityTypeMap.typeIdFor(x), groupedEntityValuesFrom(jsonConfig.entityTypes[x], solidTypeMap)])),
			solidTypeMap,
			new Map(solidTypeNames.map(x => [solidTypeMap.typeIdFor(x), { hardness: 0 }])),
			nonSolidTypeMap,
			new Map(nonSolidTypeNames.map(x => [nonSolidTypeMap.typeIdFor(x), { hardness: 0 }])),
		)
	}
}

function constantsFrom(serialised: any, typeMap: TypeMap) {
	const constants: Constants = Object.assign(new Constants(0), serialised)
	constants.playerType = typeMap.typeIdFor(serialised.playerType)
	if (serialised.chunkSize)
		constants.chunkSize = new Vector3(serialised.chunkSize.x, serialised.chunkSize.y, serialised.chunkSize.z)
	if (serialised.maxMoveSpeed)
		constants.maxMoveSpeed = serialised.maxMoveSpeed / updatesPerSecond
	return constants
}

function groupedEntityValuesFrom(jsonObject: any, blockTypeMap: TypeMap) {
	const values: GroupedEntityValues = { ...jsonObject }
	if (jsonObject.position)
		values.position = Object.assign(new Vector3(0, 0, 0), jsonObject.position)
	if (jsonObject.rectangularSize)
		values.circularSize = Object.assign(new RectangularSize(0, 0), jsonObject.rectangularSize)
	if (jsonObject.selectedBlock)
		values.selectedBlock = blockTypeMap.typeIdFor(jsonObject.selectedBlock)
	if (jsonObject.velocity)
		values.velocity = Object.assign(new Vector3(0, 0, 0), jsonObject.velocity)
	return values
}
