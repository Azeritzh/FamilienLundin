import { BaseConfig, Id, TypeMap } from "@lundin/age"
import { RenderendConstants } from "./renderend-constants"
import { GroupedEntityValues } from "./state/entity-values"

export class RenderendConfig extends BaseConfig<GroupedEntityValues> {
	constructor(
		public readonly typeMap: TypeMap,
		public readonly typeValues: Map<Id, GroupedEntityValues>,
		public readonly constants: RenderendConstants,
	) { super(typeValues) }

	public static from(constants: any, types: { [type: string]: GroupedEntityValues }) {
		const typeNames = Object.keys(types)
		const typeMap = TypeMap.from(typeNames)
		return new RenderendConfig(
			typeMap,
			new Map(typeNames.map(x => [typeMap.typeIdFor(x), types[x]])),
			new RenderendConstants(typeMap.typeIdFor(constants.shipType), typeMap.typeIdFor(constants.obstacleType)),
		)
	}
}
