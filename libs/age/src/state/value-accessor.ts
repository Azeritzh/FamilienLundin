import { Id, typeOf } from "./id"
import { BaseValues } from "./base-values"

export class ValueAccessor<T, GroupedEntityValues>{
	constructor(
		private readonly typeValues: Map<Id, GroupedEntityValues>,
		private readonly entityValue: Map<Id, T>,
		private readonly updatedEntityValue: Map<Id, T>,
		private readonly getTypeValue: (collection: GroupedEntityValues) => T,
		private readonly defaultValue: T = undefined
	) { }

	public static for<EntityValues extends BaseValues, GroupedEntityValues, T>(
		typeValues: Map<Id, GroupedEntityValues>,
		entityValues: EntityValues,
		updatedEntityValues: EntityValues,
		getValueMap: (collection: EntityValues) => Map<Id, T>,
		getTypeValue: (collection: GroupedEntityValues) => T,
		defaultValue: T = undefined,
	) {
		return new ValueAccessor(
			typeValues,
			getValueMap(entityValues),
			getValueMap(updatedEntityValues),
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

export class ValueAccessBuilder<EntityValues extends BaseValues, GroupedEntityValues>{
	constructor(
		private typeValues: Map<Id, GroupedEntityValues>,
		private entityValues: EntityValues,
		private updatedEntityValues: EntityValues,
	) { }

	public for<T>(
		getValueMap: (collection: EntityValues) => Map<Id, T>,
		getTypeValue: (collection: GroupedEntityValues) => T,
		defaultValue: T = undefined,
	) {
		return new ValueAccessor(
			this.typeValues,
			getValueMap(this.entityValues),
			getValueMap(this.updatedEntityValues),
			getTypeValue,
			defaultValue,
		)
	}
}