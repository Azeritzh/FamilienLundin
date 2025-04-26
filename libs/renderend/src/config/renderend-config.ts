import { EntityTypeOffset, Id, RectangularSize, TypeMap } from "@lundin/age"
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
		const typeMap = TypeMap.From(EntityTypeOffset, typeNames)
		return new RenderendConfig(
			constantsFrom(jsonConfig.constants, typeMap),
			typeMap,
			new Map(typeNames.map(x => [typeMap.TypeIdFor(x), groupedEntityValuesFrom(jsonConfig.types[x], typeMap)])),
		)
	}
}

function constantsFrom(serialised: any, typeMap: TypeMap) {
	const constants: RenderendConstants = Object.assign(new RenderendConstants(0, 0, []), serialised)
	constants.shipType = typeMap.TypeIdFor(serialised.shipType)
	constants.wallType = typeMap.TypeIdFor(serialised.wallType)
	constants.obstacleTypes = serialised.obstacleTypes.map((x: any) => typeMap.TypeIdFor(x))
	if (serialised.initialSpeed)
		constants.initialSpeed = serialised.initialSpeed / updatesPerSecond
	if (serialised.acceleration)
		constants.acceleration = serialised.acceleration / updatesPerSecond
	if (serialised.maxVerticalSpeed)
		constants.maxVerticalSpeed = serialised.maxVerticalSpeed / updatesPerSecond
	if (serialised.minHorisontalSpeed)
		constants.minHorisontalSpeed = serialised.minHorisontalSpeed / updatesPerSecond
	if (serialised.maxHorisontalSpeed)
		constants.maxHorisontalSpeed = serialised.maxHorisontalSpeed / updatesPerSecond
	if (serialised.chargeSpeed)
		constants.chargeSpeed = serialised.chargeSpeed / updatesPerSecond
	if (serialised.easyObstacleInterval)
		constants.easyObstacleInterval = Math.floor(serialised.easyObstacleInterval * updatesPerSecond)
	if (serialised.mediumObstacleInterval)
		constants.mediumObstacleInterval = Math.floor(serialised.mediumObstacleInterval * updatesPerSecond)
	if (serialised.hardObstacleInterval)
		constants.hardObstacleInterval = Math.floor(serialised.hardObstacleInterval * updatesPerSecond)
	if (serialised.annoyingObstacleInterval)
		constants.annoyingObstacleInterval = Math.floor(serialised.annoyingObstacleInterval * updatesPerSecond)
	return constants
}

function groupedEntityValuesFrom(serialised: any, typeMap: TypeMap) {
	const values: GroupedEntityValues = { ...serialised }
	if (serialised.position)
		values.position = Object.assign(new Vector2(0, 0), serialised.position)
	if (serialised.rectangularSize)
		values.rectangularSize = Object.assign(new RectangularSize(0, 0), serialised.rectangularSize)
	if (serialised.velocity)
		values.velocity = Object.assign(new Vector2(0, 0), serialised.velocity).multiply(1 / updatesPerSecond)
	if (serialised.bulletType)
		values.bulletType = typeMap.TypeIdFor(serialised.bulletType)
	return values
}
