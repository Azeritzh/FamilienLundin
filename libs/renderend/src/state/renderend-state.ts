import { EntityValues } from "./entity-values"
import { Globals } from "./globals"

export class RenderendState {
	constructor(
		public readonly globals: Globals,
		public readonly entityValues: EntityValues,
	) { }

	GetNewId() {
		return this.globals.nextId++
	}
}
