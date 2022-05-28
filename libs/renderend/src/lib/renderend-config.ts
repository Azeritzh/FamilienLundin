import { RenderendConstants } from "./renderend-constants"
import { GroupedEntityValues } from "./state/entity-values"

export class RenderendConfig {
	constructor(
		public readonly constants = new RenderendConstants(),
		public readonly typeValues: { [key: string]: GroupedEntityValues } = {},
	) { }
}
