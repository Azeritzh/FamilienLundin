import { AgValues } from "./ag-values"

export class EntityCollection<EntityValues extends AgValues> {
	constructor(
		public readonly entityValues: EntityValues,
		public readonly updatedEntityValues: EntityValues,
		public readonly typeValues: EntityValues,
		public readonly entities = new Map<number, boolean>(), // true: alive; false: to be deleted
	) { }

	public get(entityId: number) {
		this.entities.has(entityId)
			? this.entities[entityId]
			: null
	}

	public exists(entityId: number) {
		return this.entities.has(entityId)
	}

	public existsCurrently(entityId: number) {
		return this.entities[entityId] === true
	}

	public add(entityId: number) {
		this.entities[entityId] = true
	}

	public addWithValues(entityId: number, values: EntityValues) {
		this.entities[entityId] = true
		this.updatedEntityValues.addValuesFromOther(values)
	}

	public remove(entityId: number) {
		this.entities[entityId] = false
	}

	public fullyRemove(entityId: number) {
		this.entities.delete(entityId)
		this.entityValues.removeValuesFor(entityId)
		this.updatedEntityValues.removeValuesFor(entityId)
	}

	public applyUpdatedValues() {
		this.entityValues.addValuesFromOther(this.updatedEntityValues)
		this.updatedEntityValues.clear()
		for (const [entity, exists] of this.entities.entries())
			if (!exists)
				this.fullyRemove(entity)
	}

	*[Symbol.iterator]() {
		for (const [_, entity] of this.entities)
			yield entity
	}
}
