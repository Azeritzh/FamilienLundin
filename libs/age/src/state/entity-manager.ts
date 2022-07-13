import { BaseValues } from "./base-values"
import { Id } from "../values/entity"
import { ValueAccessor } from "./value-accessor"

export class EntityManager<EntityValues extends BaseValues> {
	protected valueAccessors: ValueAccessor<any>[] = []

	constructor(
		private entityValues: EntityValues,
		private updatedEntityValues: EntityValues,
		private idProvider: IdProvider,
	) { }

	get With(){
		return this.entityValues
	}

	public Create(type: Id) {
		const id = this.idProvider.GetNewId() | type
		this.updatedEntityValues.Entities.set(id, true)
		for (const accessor of this.valueAccessors)
			accessor.InitialiseValueFor(id)
		return id
	}

	public Remove(...entities: Id[]) {
		for (const entity of entities)
			this.updatedEntityValues.Entities.set(entity, false)
	}

	public ApplyUpdatedValues() {
		this.entityValues.AddValuesFromOther(this.updatedEntityValues)
		this.updatedEntityValues.ClearValues()
		for (const [entity, add] of this.updatedEntityValues.Entities)
			if (add)
				this.add(entity)
			else
				this.fullyRemove(entity)
		this.updatedEntityValues.Entities.clear()
		this.updatedEntityValues.Entities.clear()
	}

	private add(entityId: Id) {
		this.entityValues.Entities.set(entityId, true)
	}

	private fullyRemove(entityId: Id) {
		this.entityValues.Entities.delete(entityId)
		this.updatedEntityValues.Entities.delete(entityId)
		this.entityValues.RemoveValuesFor(entityId)
		this.updatedEntityValues.RemoveValuesFor(entityId)
	}

	*[Symbol.iterator]() {
		for (const [entity] of this.entityValues.Entities)
			yield entity
	}
}

export interface IdProvider {
	GetNewId(): Id
}
