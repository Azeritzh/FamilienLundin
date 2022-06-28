import { Id, RectangularSize, TypeMap } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { MeldConstants } from "./meld-constants"
import { BlockValues } from "./state/block-values"
import { GroupedEntityValues } from "./state/entity-values"

export class MeldConfig {
	constructor(
		public readonly constants: MeldConstants,
		public readonly typeMap: TypeMap,
		public readonly typeValues: Map<Id, GroupedEntityValues>,
		public readonly fieldValues: Map<Id, BlockValues>,
	) { }

	public static read(jsonConfig: any) {
		const typeNames = Object.keys(jsonConfig.types)
		const typeMap = TypeMap.from(typeNames)
		return new MeldConfig(
			Object.assign(new MeldConstants(), jsonConfig.constants),
			typeMap,
			new Map(typeNames.map(x => [typeMap.typeIdFor(x), groupedEntityValuesFrom(jsonConfig.types[x])])),
			new Map(),
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
