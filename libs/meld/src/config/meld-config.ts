import { Id, RectangularSize, TypeMap } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { MeldConstants } from "./meld-constants"
import { BlockValues } from "../state/block-values"
import { GroupedEntityValues } from "../state/entity-values"
import { updatesPerSecond } from "../meld-game"

export class MeldConfig {
	constructor(
		public readonly constants: MeldConstants,
		public readonly entityTypeMap: TypeMap,
		public readonly entityTypeValues: Map<Id, GroupedEntityValues>,
		public readonly blockTypeMap: TypeMap,
		public readonly blockTypeValues: Map<Id, BlockValues>,
	) { }

	public static read(jsonConfig: any) {
		const entityTypeNames = Object.keys(jsonConfig.entityTypes)
		const entityTypeMap = TypeMap.from(entityTypeNames)
		const blockTypeNames = Object.keys(jsonConfig.blockTypes)
		const blockTypeMap = TypeMap.from(blockTypeNames)
		return new MeldConfig(
			constantsFrom(jsonConfig.constants, entityTypeMap),
			entityTypeMap,
			new Map(entityTypeNames.map(x => [entityTypeMap.typeIdFor(x), groupedEntityValuesFrom(jsonConfig.entityTypes[x], blockTypeMap)])),
			blockTypeMap,
			new Map(blockTypeNames.map(x => [blockTypeMap.typeIdFor(x), { hardness: 0 }])),
		)
	}
}

function constantsFrom(serialised: any, typeMap: TypeMap) {
	const constants: MeldConstants = Object.assign(new MeldConstants(0), serialised)
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
		values.rectangularSize = Object.assign(new RectangularSize(0, 0), jsonObject.rectangularSize)
	if (jsonObject.selectedBlock)
		values.selectedBlock = blockTypeMap.typeIdFor(jsonObject.selectedBlock)
	if (jsonObject.velocity)
		values.velocity = Object.assign(new Vector3(0, 0, 0), jsonObject.velocity)
	return values
}
