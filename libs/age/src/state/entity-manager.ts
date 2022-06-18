import { BaseValues } from "./base-values"
import { Id, typeOf } from "./id"
import { ValueAccessor } from "./value-accessor"

export class EntityManager<EntityValues extends BaseValues, BehaviourType> {
	protected valueAccessors: ValueAccessor<any>[] = []

	constructor(
		private typeBehaviours: Map<Id, BehaviourType[]>,
		private entityValues: EntityValues,
		private updatedEntityValues: EntityValues,
		private idProvider: IdProvider,
		private behaviourLists = new Map<BehaviourType, Id[]>(),
	) {
		this.setupBehaviours()
	}

	private setupBehaviours() {
		for (const behaviours of this.typeBehaviours.values())
			for (const behaviour of behaviours)
				this.behaviourLists.set(behaviour, [])
	}

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
		this.updatedEntityValues.clear()
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
		for (const behaviour of this.typeBehaviours.get(typeOf(entityId)))
			this.behaviourLists.get(behaviour).push(entityId)
	}

	private fullyRemove(entityId: Id) {
		this.entityValues.entities.delete(entityId)
		this.updatedEntityValues.entities.delete(entityId)
		this.entityValues.removeValuesFor(entityId)
		this.updatedEntityValues.removeValuesFor(entityId)
		for (const behaviour of this.typeBehaviours.get(typeOf(entityId)))
			this.behaviourLists.get(behaviour).remove(entityId)
	}

	*[Symbol.iterator]() {
		for (const [entity] of this.entityValues.entities)
			yield entity
	}
}

export interface IdProvider {
	getNewId(): Id
}
