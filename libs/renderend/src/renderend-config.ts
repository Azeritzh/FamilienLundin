import { BaseConfig, Id, TypeMap } from "@lundin/age"
import { RenderendConstants } from "./renderend-constants"
import { Behaviour, GroupedEntityValues } from "./state/entity-values"

export class RenderendConfig extends BaseConfig<GroupedEntityValues, Behaviour> {
	constructor(
		public readonly typeMap: TypeMap,
		public readonly typeValues: Map<Id, GroupedEntityValues>,
		public readonly typeBehaviours: Map<Id, Behaviour[]>,
		public readonly constants: RenderendConstants,
	) { super(typeValues, typeBehaviours) }

	public static from(constants: any, types: { [type: string]: GroupedEntityValues & { behaviours: Behaviour[] } }) {
		const typeNames = Object.keys(types)
		const typeMap = TypeMap.from(typeNames)
		return new RenderendConfig(
			typeMap,
			new Map(typeNames.map(x => [typeMap.typeIdFor(x), types[x]])),
			new Map(typeNames.map(x => [typeMap.typeIdFor(x), types[x].behaviours])),
			new RenderendConstants(
				typeMap.typeIdFor(constants.shipType),
				typeMap.typeIdFor(constants.wallType),
				constants.obstacleTypes.map(x => typeMap.typeIdFor(x)),
			),
		)
	}
}
