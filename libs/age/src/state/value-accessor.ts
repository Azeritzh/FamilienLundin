import { AgValues, Id } from "./ag-values"
import { BaseChanges } from "./base-changes"
import { BaseConfig } from "./base-config"
import { BaseState } from "./base-state"

export class ValueAccessor<T, GroupedEntityValues>{
	constructor(
		private readonly typeValues: Map<Id, GroupedEntityValues>,
		private readonly entityValue: Map<Id, T>,
		private readonly updatedEntityValue: Map<Id, T>,
		private readonly getTypeValue: (collection: GroupedEntityValues) => T,
	) { }

	public static For<EntityValues extends AgValues, GroupedEntityValues, BehaviourType, T>(
		config: BaseConfig<GroupedEntityValues, BehaviourType>,
		state: BaseState<any, any, EntityValues>,
		changes: BaseChanges<EntityValues>,
		getValueMap: (collection: EntityValues) => Map<Id, T>,
		getTypeValue: (collection: GroupedEntityValues) => T,
	) {
		return new ValueAccessor(
			config.typeValues,
			getValueMap(state.entityValues),
			getValueMap(changes.updatedEntityValues),
			getTypeValue,
		)
	}

	public currentlyOf(entity: Id) {
		return this.updatedEntityValue.get(entity)
			?? this.of(entity)
	}

	public of(entity: Id) {
		return this.entityValue.get(entity)
			?? this.defaultOf(entity)
	}

	public defaultOf(entity: Id) {
		const type = BaseState.typeOf(entity)
		return this.getTypeValue(this.typeValues.get(type))
	}

	public setFor(entity: Id, value: T) {
		this.updatedEntityValue.set(entity, value)
	}
}