import { BaseValues } from "./base-values"
import { Id } from "./id"
import { ValueAccessor } from "./value-accessor"

export class EntityManager<EntityValues extends BaseValues> {
	protected valueAccessors: ValueAccessor<any>[] = []

	constructor(
		private entityValues: EntityValues,
		private updatedEntityValues: EntityValues,
		private idProvider: IdProvider,
	) { }

	get with(){
		return this.entityValues
	}

	public create(type: Id) {
		const id = this.idProvider.getNewId() | type
		this.updatedEntityValues.entities.set(id, true)
		for (const accessor of this.valueAccessors)
			accessor.initialiseValueFor(id)
		return id
	}

	public remove(...entities: Id[]) {
		for (const entity of entities)
			this.updatedEntityValues.entities.set(entity, false)
	}

	public applyUpdatedValues() {
		this.entityValues.addValuesFromOther(this.updatedEntityValues)
		this.updatedEntityValues.clearValues()
		for (const [entity, add] of this.updatedEntityValues.entities)
			if (add)
				this.add(entity)
			else
				this.fullyRemove(entity)
		this.updatedEntityValues.entities.clear()
		this.updatedEntityValues.entities.clear()
	}

	private add(entityId: Id) {
		this.entityValues.entities.set(entityId, true)
	}

	private fullyRemove(entityId: Id) {
		this.entityValues.entities.delete(entityId)
		this.updatedEntityValues.entities.delete(entityId)
		this.entityValues.removeValuesFor(entityId)
		this.updatedEntityValues.removeValuesFor(entityId)
	}

	*[Symbol.iterator]() {
		for (const [entity] of this.entityValues.entities)
			yield entity
	}
}

export interface IdProvider {
	getNewId(): Id
}
