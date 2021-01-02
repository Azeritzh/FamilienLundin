import { EntitySize } from "../values/entity-size"
import { Positioning } from "../values/positioning"

export class EntityValues<TKey> {
	private readonly allValueMaps: Map<TKey, any>[] = []

	constructor(
		public readonly entitySizeValues: Map<TKey, EntitySize> = new Map<TKey, EntitySize>(),
		public readonly healthValues: Map<TKey, number> = new Map<TKey, number>(),
		public readonly positioningValues: Map<TKey, Positioning> = new Map<TKey, Positioning>(),
	) {
		this.register(entitySizeValues)
		this.register(healthValues)
		this.register(positioningValues)
	}

	private register<TValue>(map: Map<TKey, TValue>) {
		this.allValueMaps.push(map)
		return map
	}

	clear() {
		for (const map of this.allValueMaps)
			map.clear()
	}

	removeValuesFor(key: TKey) {
		for (const map of this.allValueMaps)
			map.delete(key)
	}

	addValuesFromOther(otherValues: EntityValues<TKey>) {
		for (let i = 0; i < this.allValueMaps.length; i++)
			for (const [key, value] of otherValues.allValueMaps[i])
				this.allValueMaps[i].set(key, value)
	}

	where(predicate: (key: TKey) => boolean): EntityValues<TKey> {
		const newValues = new EntityValues<TKey>()
		for (let i = 0; i < this.allValueMaps.length; i++)
			for (const [key, value] of this.allValueMaps[i])
				if (predicate(key))
					newValues.allValueMaps[i].set(key, value)
		return newValues
	}

	addValuesFrom(key: TKey, values: GroupedEntityValues) {
		if (values.entitySize !== undefined)
			this.entitySizeValues.set(key, values.entitySize)
		if (values.health !== undefined)
			this.healthValues.set(key, values.health)
		if (values.positioning !== undefined)
			this.positioningValues.set(key, values.positioning)
	}

	groupFor(key: TKey) {
		return new GroupedEntityValues(
			this.entitySizeValues.get(key),
			this.healthValues.get(key),
			this.positioningValues.get(key),
		)
	}
}

export class GroupedEntityValues {
	constructor(
		public entitySize?: EntitySize,
		public health?: number,
		public positioning?: Positioning,
	) { }
}
