import { Id, TypeMap } from "@lundin/age"
import { RenderendConstants } from "./renderend-constants"
import { GroupedEntityValues } from "./state/entity-values"

export class RenderendConfig {
	constructor(
		public readonly typeMap: TypeMap,
		public readonly constants = new RenderendConstants(typeMap.typeIdFor("ship")),
		public readonly typeValues = new Map<Id, GroupedEntityValues>(),
	) { }
}
