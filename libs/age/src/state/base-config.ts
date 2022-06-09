import { Id } from "./ag-values"

export abstract class BaseConfig<GroupedEntityValues, BehaviourType> {
	constructor(
		public readonly typeValues: Map<Id, GroupedEntityValues>,
		public readonly typeBehaviours: Map<Id, BehaviourType[]>,
	) { }
}
