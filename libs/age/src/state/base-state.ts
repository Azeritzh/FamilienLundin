import { Id } from "./base-config"
import { BaseGlobals } from "./base-globals"
import { BaseValues } from "./base-values"

export abstract class BaseState<Globals extends BaseGlobals, Field, EntityValues extends BaseValues> {
	constructor(
		public readonly globals: Globals,
		public readonly entityValues: EntityValues,
		public readonly entities: Id[] = [],
		public readonly chunks = new Map<string, Field[]>(), // Optimally the key would be a Vector3, but it'll use the object reference, so we instead convert it to a string: 1,2,3
	) { }
}
