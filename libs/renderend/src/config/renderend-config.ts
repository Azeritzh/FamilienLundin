import { Id, RectangularSize, TypeMap } from "@lundin/age"
import { RenderendConstants } from "./renderend-constants"
import { GroupedEntityValues } from "../state/entity-values"
import { Vector2 } from "@lundin/utility"

export class RenderendConfig {
	constructor(
		public readonly constants: RenderendConstants,
		public readonly typeMap: TypeMap,
		public readonly typeValues: Map<Id, GroupedEntityValues>,
	) { }

	public static read(jsonConfig: any) {
		const typeNames = Object.keys(jsonConfig.types)
		const typeMap = TypeMap.from(typeNames)
		const constants = Object.assign(new RenderendConstants(0, 0, []), jsonConfig.constants)
		constants.shipType = typeMap.typeIdFor(jsonConfig.constants.shipType)
		constants.wallType = typeMap.typeIdFor(jsonConfig.constants.wallType)
		constants.obstacleTypes = jsonConfig.constants.obstacleTypes.map(x => typeMap.typeIdFor(x))
		return new RenderendConfig(
			constants,
			typeMap,
			new Map(typeNames.map(x => [typeMap.typeIdFor(x), groupedEntityValuesFrom(jsonConfig.types[x], typeMap)])),
		)
	}
}

function groupedEntityValuesFrom(jsonObject: any, typeMap: TypeMap) {
	const values: GroupedEntityValues = { ...jsonObject }
	if (jsonObject.position)
		values.position = Object.assign(new Vector2(0, 0), jsonObject.position)
	if (jsonObject.rectangularSize)
		values.rectangularSize = Object.assign(new RectangularSize(0, 0), jsonObject.rectangularSize)
	if (jsonObject.velocity)
		values.velocity = Object.assign(new Vector2(0, 0), jsonObject.velocity)
	if (jsonObject.bulletType)
		values.bulletType = typeMap.typeIdFor(jsonObject.bulletType)
	return values
}
