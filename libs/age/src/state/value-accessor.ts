import { Id, EntityTypeOf } from "../values/entity"
import { BaseValues } from "./base-values"

export interface ValueInitialiser {
	/** This is supposed to take the default value for the type and copy it to the entity (or rather, to the value map) */
	initialiseValueFor(entity: Id)
}

export class ValueAccessor<T>{
	constructor(
		public readonly get: ValueGetter<T>,
		public readonly set: ValueSetter<T>,
	) { }

	public initialiseValueFor(entity: Id) {
		const defaultValue = this.get.defaultOf(entity)
		if (defaultValue != null)
			this.set.for(entity, defaultValue)
	}
}

export interface ValueGetter<T> {
	currentlyOf(entity: Id): T
	of(entity: Id): T
	defaultOf(entity: Id): T
}

export class StandardValueGetter<T, GroupedEntityValues> implements ValueGetter<T> {
	constructor(
		private readonly typeValues: Map<Id, GroupedEntityValues>,
		private readonly entityValue: Map<Id, T>,
		private readonly updatedEntityValue: Map<Id, T>,
		private readonly getTypeValue: (collection: GroupedEntityValues) => T,
		private readonly defaultValue: T = undefined
	) { }

	public currentlyOf(entity: Id) {
		return this.updatedEntityValue.get(entity)
			?? this.of(entity)
	}

	public of(entity: Id) {
		return this.entityValue.get(entity)
	}

	public defaultOf(entity: Id) {
		const type = EntityTypeOf(entity)
		return this.getTypeValue(this.typeValues.get(type))
			?? this.defaultValue
	}
}

export class ValueSetter<T>{
	constructor(
		private readonly updatedEntityValue: Map<Id, T>,
	) { }

	public for(entity: Id, value: T) {
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
			new StandardValueGetter(
				this.typeValues,
				getValueMap(this.entityValues),
				getValueMap(this.updatedEntityValues),
				getTypeValue,
				defaultValue,
			),
			new ValueSetter(getValueMap(this.updatedEntityValues)),
		)
	}
}