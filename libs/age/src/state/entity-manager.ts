import { BaseValues } from "./base-values"
import { Id } from "../values/entity"
import { ValueAccessor } from "./value-accessor"

export class EntityManager<EntityValues extends BaseValues> {
	protected Accessors: ValueAccessor<any>[] = []

	constructor(
		private entityValues: EntityValues,
		private updatedEntityValues: EntityValues,
		private idProvider: IdProvider,
	) { }

	get With(){
		return this.entityValues
	}

	get All(){
		return this.entityValues.Entities.keys()
	}

	public Create(type: Id) {
		const id = this.idProvider.GetNewId() | type
		this.updatedEntityValues.Entities.set(id, true)
		for (const accessor of this.Accessors)
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
				this.Add(entity)
			else
				this.FullyRemove(entity)
		this.updatedEntityValues.Entities.clear()
	}

	private Add(entityId: Id) {
		this.entityValues.Entities.set(entityId, true)
	}

	private FullyRemove(entityId: Id) {
		this.entityValues.Remove(entityId)
		this.updatedEntityValues.Remove(entityId)
	}

	public Exists(entity: Id) {
		return this.entityValues.Entities.has(entity)
	}

	*[Symbol.iterator]() {
		for (const [entity] of this.entityValues.Entities)
			yield entity
	}
}

export interface IdProvider {
	GetNewId(): Id
}
