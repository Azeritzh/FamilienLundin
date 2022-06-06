import { AgValues, Id } from "@lundin/age"
import { EntitySize } from "../values/entity-size"
import { Positioning } from "../values/positioning"

export class EntityValues extends AgValues {
	constructor(
		public readonly entitySizeValues = new Map<Id, EntitySize>(),
		public readonly healthValues = new Map<Id, number>(),
		public readonly positioningValues = new Map<Id, Positioning>(),
	) {
		super()
		this.register(entitySizeValues)
		this.register(healthValues)
		this.register(positioningValues)
	}

	public static from(groupedValues: Map<Id, GroupedEntityValues>) {
		const entityValues = new EntityValues()
		for (const [id, values] of groupedValues)
			entityValues.addValuesFrom(id, values)
		return entityValues
	}

	addValuesFrom(key: Id, values: GroupedEntityValues) {
		if (values.entitySize !== undefined)
			this.entitySizeValues.set(key, values.entitySize)
		if (values.health !== undefined)
			this.healthValues.set(key, values.health)
		if (values.positioning !== undefined)
			this.positioningValues.set(key, values.positioning)
	}

	groupFor(key: Id): GroupedEntityValues {
		return {
			entitySize: this.entitySizeValues.get(key),
			health: this.healthValues.get(key),
			positioning: this.positioningValues.get(key),
		}
	}
}

export interface GroupedEntityValues {
	entitySize?: EntitySize
	health?: number
	positioning?: Positioning
}
