import { Id, RectangularSize, TypeMap } from "@lundin/age"
import { RenderendConstants } from "./renderend-constants"
import { GroupedEntityValues } from "../state/entity-values"
import { Vector2 } from "@lundin/utility"
import { updatesPerSecond } from "../renderend-game"

export class RenderendConfig {
	constructor(
		public readonly constants: RenderendConstants,
		public readonly typeMap: TypeMap,
		public readonly typeValues: Map<Id, GroupedEntityValues>,
	) { }

	public static read(jsonConfig: any) {
		const typeNames = Object.keys(jsonConfig.types)
		const typeMap = TypeMap.from(typeNames)
		return new RenderendConfig(
			constantsFrom(jsonConfig.constants, typeMap),
			typeMap,
			new Map(typeNames.map(x => [typeMap.typeIdFor(x), groupedEntityValuesFrom(jsonConfig.types[x], typeMap)])),
		)
	}
}

function constantsFrom(jsonObject: any, typeMap: TypeMap) {
	const constants = Object.assign(new RenderendConstants(0, 0, []), jsonObject)
	constants.shipType = typeMap.typeIdFor(jsonObject.shipType)
	constants.wallType = typeMap.typeIdFor(jsonObject.wallType)
	constants.obstacleTypes = jsonObject.obstacleTypes.map(x => typeMap.typeIdFor(x))
	if (jsonObject.initialSpeed)
		constants.initialSpeed = jsonObject.initialSpeed / updatesPerSecond
	if (jsonObject.acceleration)
		constants.acceleration = jsonObject.acceleration / updatesPerSecond
	if (jsonObject.maxVerticalSpeed)
		constants.maxVerticalSpeed = jsonObject.maxVerticalSpeed / updatesPerSecond
	if (jsonObject.minHorisontalSpeed)
		constants.minHorisontalSpeed = jsonObject.minHorisontalSpeed / updatesPerSecond
	if (jsonObject.maxHorisontalSpeed)
		constants.maxHorisontalSpeed = jsonObject.maxHorisontalSpeed / updatesPerSecond
	if (jsonObject.chargeSpeed)
		constants.chargeSpeed = jsonObject.chargeSpeed / updatesPerSecond
	if (jsonObject.easyObstacleInterval)
		constants.easyObstacleInterval = Math.floor(jsonObject.easyObstacleInterval * updatesPerSecond)
	if (jsonObject.mediumObstacleInterval)
		constants.mediumObstacleInterval = Math.floor(jsonObject.mediumObstacleInterval * updatesPerSecond)
	if (jsonObject.hardObstacleInterval)
		constants.hardObstacleInterval = Math.floor(jsonObject.hardObstacleInterval * updatesPerSecond)
	if (jsonObject.annoyingObstacleInterval)
		constants.annoyingObstacleInterval = Math.floor(jsonObject.annoyingObstacleInterval * updatesPerSecond)
	return constants
}

function groupedEntityValuesFrom(jsonObject: any, typeMap: TypeMap) {
	const values: GroupedEntityValues = { ...jsonObject }
	if (jsonObject.position)
		values.position = Object.assign(new Vector2(0, 0), jsonObject.position)
	if (jsonObject.rectangularSize)
		values.rectangularSize = Object.assign(new RectangularSize(0, 0), jsonObject.rectangularSize)
	if (jsonObject.velocity)
		values.velocity = Object.assign(new Vector2(0, 0), jsonObject.velocity).multiply(1 / updatesPerSecond)
	if (jsonObject.bulletType)
		values.bulletType = typeMap.typeIdFor(jsonObject.bulletType)
	return values
}
