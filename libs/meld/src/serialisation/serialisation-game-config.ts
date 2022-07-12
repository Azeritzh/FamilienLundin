import { CircularSize, EntityTypeOffset, TypeMap } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Constants } from "../config/constants"
import { GameConfig } from "../config/game-config"
import { updatesPerSecond } from "../meld-game"
import { NonSolidOffset, SolidOffset } from "../state/block"
import { GroupedEntityValues } from "../state/entity-values"

export function readGameConfig(jsonConfig: any) {
	const entityTypeNames = Object.keys(jsonConfig.entityTypes)
	const entityTypeMap = TypeMap.From(EntityTypeOffset, entityTypeNames)
	const solidTypeNames = Object.keys(jsonConfig.solidTypes)
	const solidTypeMap = TypeMap.From(SolidOffset, solidTypeNames)
	const nonSolidTypeNames = Object.keys(jsonConfig.nonSolidTypes)
	const nonSolidTypeMap = TypeMap.From(NonSolidOffset, nonSolidTypeNames)
	return new GameConfig(
		constantsFrom(jsonConfig.constants, entityTypeMap),
		entityTypeMap,
		new Map(entityTypeNames.map(x => [entityTypeMap.TypeIdFor(x), groupedEntityValuesFrom(jsonConfig.entityTypes[x], solidTypeMap)])),
		solidTypeMap,
		new Map(solidTypeNames.map(x => [solidTypeMap.TypeIdFor(x), { hardness: 0 }])),
		nonSolidTypeMap,
		new Map(nonSolidTypeNames.map(x => [nonSolidTypeMap.TypeIdFor(x), { hardness: 0 }])),
	)
}

function constantsFrom(serialised: any, typeMap: TypeMap) {
	const constants: Constants = Object.assign(new Constants(0), serialised)
	constants.playerType = typeMap.TypeIdFor(serialised.playerType)
	if (serialised.chunkSize)
		constants.chunkSize = new Vector3(serialised.chunkSize.x, serialised.chunkSize.y, serialised.chunkSize.z)
	constants.gravityAcceleration = (serialised.gravityAcceleration ?? 0.5) / updatesPerSecond
	constants.terminalVerticalVelocity = (serialised.terminalVerticalVelocity ?? 10) / updatesPerSecond
	constants.maxMoveSpeed = (serialised.maxMoveSpeed ?? 10) / updatesPerSecond
	return constants
}

function groupedEntityValuesFrom(jsonObject: any, blockTypeMap: TypeMap) {
	const values: GroupedEntityValues = { ...jsonObject }
	if (jsonObject.position)
		values.position = Object.assign(new Vector3(0, 0, 0), jsonObject.position)
	if (jsonObject.circularSize)
		values.circularSize = Object.assign(new CircularSize(0, 0), jsonObject.circularSize)
	if (jsonObject.selectedBlock)
		values.selectedBlock = blockTypeMap.TypeIdFor(jsonObject.selectedBlock)
	if (jsonObject.velocity)
		values.velocity = Object.assign(new Vector3(0, 0, 0), jsonObject.velocity)
	return values
}
