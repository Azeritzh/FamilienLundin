import { Id, EntityTypeOf } from "../values/entity"
import { BaseValues } from "./base-values"

export interface ValueInitialiser {
	/** This is supposed to take the default value for the type and copy it to the entity (or rather, to the value map) */
	initialiseValueFor(entity: Id): void
}

export class ValueAccessor<T> {
	constructor(
		public readonly Get: ValueGetter<T>,
		public readonly Set: ValueSetter<T>,
	) { }

	public InitialiseValueFor(entity: Id) {
		const defaultValue = this.Get.DefaultOf(entity)
		if (defaultValue != null)
			this.Set.For(entity, defaultValue)
	}
}

export interface ValueGetter<T> {
	CurrentlyOf(entity: Id): T | undefined
	Of(entity: Id): T | undefined
	DefaultOf(entity: Id): T | undefined
}

export class StandardValueGetter<T, GroupedEntityValues> implements ValueGetter<T> {
	constructor(
		private readonly typeValues: Map<Id, GroupedEntityValues>,
		private readonly entityValue: Map<Id, T>,
		private readonly updatedEntityValue: Map<Id, T>,
		private readonly getTypeValue: (collection: GroupedEntityValues) => T | null | undefined,
		private readonly defaultValue: T | undefined = undefined
	) { }

	public CurrentlyOf(entity: Id) {
		return this.updatedEntityValue.get(entity)
			?? this.Of(entity)
	}

	public Of(entity: Id) {
		return this.entityValue.get(entity)
	}

	public DefaultOf(entity: Id) {
		const type = EntityTypeOf(entity)
		const values = this.typeValues.get(type)
		if (values)
			return this.getTypeValue(values) ?? this.defaultValue
		return this.defaultValue
	}
}

export class ValueSetter<T> {
	constructor(
		private readonly updatedEntityValue: Map<Id, T>,
	) { }

	public For(entity: Id, value: T) {
		this.updatedEntityValue.set(entity, value)
	}
}

export class ValueAccessBuilder<EntityValues extends BaseValues, GroupedEntityValues> {
	constructor(
		private typeValues: Map<Id, GroupedEntityValues>,
		private entityValues: EntityValues,
		private updatedEntityValues: EntityValues,
	) { }

	public For<T>(
		getValueMap: (collection: EntityValues) => Map<Id, T>,
		getTypeValue: (collection: GroupedEntityValues) => T | null | undefined,
		defaultValue: T | undefined = undefined,
	) {
		return new ValueAccessor<T>(
			new StandardValueGetter<T, GroupedEntityValues>(
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