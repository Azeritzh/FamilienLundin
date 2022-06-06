import { AgValues, Id } from "./ag-values"

export class EntityCollection<EntityValues extends AgValues> {
	constructor(
		public readonly entityValues: EntityValues,
		public readonly updatedEntityValues: EntityValues,
		public readonly typeValues: EntityValues,
		public readonly entities: Id[] = [],
		public readonly createdEntities: Id[] = [],
		public readonly removedEntities: Id[] = [],
	) { }

	public exists(entityId: Id) {
		return this.entities.includes(entityId)
	}

	public existsCurrently(entityId: Id) {
		if (this.createdEntities.includes(entityId))
			return true
		if (this.removedEntities.includes(entityId))
			return false
		return this.exists(entityId)
	}

	public add(entityId: Id) {
		this.createdEntities.push(entityId)
	}

	public addWithValues(entityId: Id, values: EntityValues) {
		this.createdEntities.push(entityId)
		this.updatedEntityValues.addValuesFromOther(values)
	}

	public remove(entityId: Id) {
		this.removedEntities.push(entityId)
	}

	public applyUpdatedValues() {
		this.entityValues.addValuesFromOther(this.updatedEntityValues)
		this.updatedEntityValues.clear()
		for (const entity of this.createdEntities)
			this.entities.push(entity)
		for (const entity of this.removedEntities)
			this.fullyRemove(entity)
		this.createdEntities.clear()
		this.removedEntities.clear()
	}

	private fullyRemove(entityId: Id) {
		this.entities.remove(entityId)
		this.createdEntities.remove(entityId)
		this.entityValues.removeValuesFor(entityId)
		this.updatedEntityValues.removeValuesFor(entityId)
	}

	*[Symbol.iterator]() {
		for (const entity of this.entities)
			yield entity
	}
}
