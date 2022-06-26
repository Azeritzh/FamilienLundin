import { Id, RectangularSize, TypeMap } from "@lundin/age"
import { RenderendConstants } from "./renderend-constants"
import { GroupedEntityValues } from "../state/entity-values"
import { Vector2 } from "@lundin/utility"

export class RenderendConfig {
	constructor(
		public readonly typeMap: TypeMap,
		public readonly typeValues: Map<Id, GroupedEntityValues>,
		public readonly constants: RenderendConstants,
	) { }

	public static from(constants: any, types: { [type: string]: GroupedEntityValues }) {
		const typeNames = Object.keys(types)
		const typeMap = TypeMap.from(typeNames)
		return new RenderendConfig(
			typeMap,
			new Map(typeNames.map(x => [typeMap.typeIdFor(x), types[x]])),
			new RenderendConstants(
				typeMap.typeIdFor(constants.shipType),
				typeMap.typeIdFor(constants.wallType),
				constants.obstacleTypes.map(x => typeMap.typeIdFor(x)),
			),
		)
	}

	public static read(jsonConfig: any) {
		const typeNames = Object.keys(jsonConfig.types)
		const typeMap = TypeMap.from(typeNames)
		return new RenderendConfig(
			typeMap,
			new Map(typeNames.map(x => [typeMap.typeIdFor(x), groupedEntityValuesFrom(jsonConfig.types[x])])),
			new RenderendConstants(
				typeMap.typeIdFor(jsonConfig.constants.shipType),
				typeMap.typeIdFor(jsonConfig.constants.wallType),
				jsonConfig.constants.obstacleTypes.map(x => typeMap.typeIdFor(x)),
			),
		)
	}
}

function groupedEntityValuesFrom(jsonObject: any) {
	const values: GroupedEntityValues = { ...jsonObject }
	if (jsonObject.position)
		values.position = Object.assign(new Vector2(0, 0), jsonObject.position)
	if (jsonObject.rectangularSize)
		values.rectangularSize = Object.assign(new RectangularSize(0, 0), jsonObject.rectangularSize)
	if (jsonObject.velocity)
		values.velocity = Object.assign(new Vector2(0, 0), jsonObject.velocity)
	return values
}