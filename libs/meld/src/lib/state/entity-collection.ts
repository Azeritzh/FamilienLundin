import { Entity } from "./entity"
import { EntityValues } from "./entity-values"

export class EntityCollection {
	constructor(
		public readonly entities = new Map<number, Entity>(),
		public readonly entityValues = new EntityValues<number>(),
		public readonly updatedEntityValues = new EntityValues<number>(),
		public readonly typeValues = new EntityValues<number>(),
		public readonly classValues = new EntityValues<any>(), //Type
	) { }


	public get(index: number) {
		this.entities.has(index)
			? this.entities[index]
			: null
	}

	public has(entityId: number) {
		return this.entities.has(entityId)
	}

	public add(entity: Entity) {
		this.entities[entity.id] = entity
	}

	public addWithValues(entity: Entity, values: EntityValues<number>) {
		this.entities[entity.id] = entity
		this.updatedEntityValues.addValuesFromOther(values)
	}

	public remove(entityId: number) {
		this.entities.delete(entityId)
		// TODO: remove values
		// hm... from updated or not or..?
	}

	public applyUpdatedValues() {
		this.entityValues.addValuesFromOther(this.updatedEntityValues)
		this.updatedEntityValues.clear()
	}

	*[Symbol.iterator]() {
		for (const [_, entity] of this.entities)
			yield entity
	}
}
