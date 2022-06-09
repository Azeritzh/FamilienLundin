import { BaseChanges } from "./base-changes"
import { BaseConfig, Id, typeOf } from "./base-config"
import { BaseState } from "./base-state"
import { BaseValues } from "./base-values"

export class ValueAccessor<T, GroupedEntityValues>{
	constructor(
		private readonly typeValues: Map<Id, GroupedEntityValues>,
		private readonly entityValue: Map<Id, T>,
		private readonly updatedEntityValue: Map<Id, T>,
		private readonly getTypeValue: (collection: GroupedEntityValues) => T,
		private readonly defaultValue: T = undefined
	) { }

	public static For<EntityValues extends BaseValues, GroupedEntityValues, BehaviourType, T>(
		config: BaseConfig<GroupedEntityValues, BehaviourType>,
		state: BaseState<any, any, EntityValues>,
		changes: BaseChanges<EntityValues>,
		getValueMap: (collection: EntityValues) => Map<Id, T>,
		getTypeValue: (collection: GroupedEntityValues) => T,
		defaultValue: T = undefined,
	) {
		return new ValueAccessor(
			config.typeValues,
			getValueMap(state.entityValues),
			getValueMap(changes.updatedEntityValues),
			getTypeValue,
			defaultValue,
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
		const type = typeOf(entity)
		return this.getTypeValue(this.typeValues.get(type))
			?? this.defaultValue
	}

	public setFor(entity: Id, value: T) {
		this.updatedEntityValue.set(entity, value)
	}
}