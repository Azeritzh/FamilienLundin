import { EntityValues } from "./entity-values"

export class RenderendChanges {
	constructor(
		public readonly updatedEntityValues: EntityValues,
	) { }
}
