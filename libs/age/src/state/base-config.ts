import { Id } from "./ag-values"

export abstract class BaseConfig<GroupedEntityValues> {
	constructor(
		public readonly typeValues: Map<Id, GroupedEntityValues>,
	) { }
}
