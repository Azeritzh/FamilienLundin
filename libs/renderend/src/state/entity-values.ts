import { AgValues, Id, TypeMap } from "@lundin/age"
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

	public static from(typeValues: { [type: string]: GroupedEntityValues }, typeMap: TypeMap) {
		const values = new EntityValues()
		for (const [type, typeId] of typeMap.types)
			values.addValuesFrom(typeId, typeValues[type])
		return values
	}

	addValuesFrom(key: Id, values: GroupedEntityValues) {
		if (values.entitySize !== undefined)
			this.entitySizeValues.set(key, values.entitySize)
		if (values.health !== undefined)
			this.healthValues.set(key, values.health)
		if (values.positioning !== undefined)
			this.positioningValues.set(key, values.positioning)
	}

	groupFor(key: Id) {
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
