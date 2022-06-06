import { AgState } from "./ag-state"
import { AgValues, Id } from "./ag-values"

export class ValueAccessor<T>{
	constructor(
		private readonly entityValue: Map<Id, T>,
		private readonly updatedEntityValue: Map<Id, T>,
		private readonly typeValue: Map<Id, T>,
	) { }

	public static For<V extends AgValues, T>(state: AgState<any, any, V>, getter: (collection: V) => Map<Id, T>) {
		return new ValueAccessor(
			getter(state.entities.entityValues),
			getter(state.entities.updatedEntityValues),
			getter(state.entities.typeValues),
		)
	}

	public of(entity: Id) {
		return this.entityValue.get(entity)
			?? this.typeValue.get(AgState.typeOf(entity))
	}

	public currentlyOf(entity: Id) {
		return this.updatedEntityValue.get(entity)
			?? this.of(entity)
	}

	public setFor(entity: Id, value: T) {
		this.updatedEntityValue.set(entity, value)
	}
}