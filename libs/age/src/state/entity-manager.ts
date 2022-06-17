import { BaseValues } from "./base-values"
import { Id, typeOf } from "./id"

export class EntityManager<EntityValues extends BaseValues, BehaviourType> {
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

	public with(behaviour: BehaviourType) {
		return this.behaviourLists.get(behaviour) ?? []
	}

	public create(type: Id) {
		const id = this.idProvider.getNewId() | type
		this.updatedEntityValues.entities.set(id, true)
		return id
	}

	public remove(...entities: Id[]) {
		for(const entity of entities)
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

interface IdProvider {
	getNewId(): Id
}
