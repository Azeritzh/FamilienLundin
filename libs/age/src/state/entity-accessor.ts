import { AgValues, Id } from "./ag-values"
import { BaseChanges } from "./base-changes"
import { BaseConfig } from "./base-config"
import { BaseState } from "./base-state"

export class EntityAccessor<EntityValues extends AgValues, GroupedEntityValues, BehaviourType> {
	constructor(
		private config: BaseConfig<GroupedEntityValues, BehaviourType>, // this is here in order to make behaviour based lists of entities later
		private state: BaseState<any, any, EntityValues>,
		private changes: BaseChanges<EntityValues>,
		private behaviourLists = new Map<BehaviourType, Id[]>(),
	) {
		this.setupBehaviours()
	}

	private setupBehaviours() {
		for (const behaviours of this.config.typeBehaviours.values())
			for (const behaviour of behaviours)
				this.behaviourLists.set(behaviour, [])
	}

	public with(behaviour: BehaviourType) {
		if (this.behaviourLists.has(behaviour))
			return this.behaviourLists.get(behaviour)
		return []
	}

	public create(type: Id) {
		const id = this.state.nextId | type
		this.state.nextId++
		this.changes.createdEntities.push(id)
		return id
	}
	public remove(...entityId: Id[]) {
		this.changes.removedEntities.push(...entityId)
	}

	public applyUpdatedValues() {
		this.state.entityValues.addValuesFromOther(this.changes.updatedEntityValues)
		this.changes.updatedEntityValues.clear()
		for (const entity of this.changes.createdEntities)
			this.add(entity)
		for (const entity of this.changes.removedEntities)
			this.fullyRemove(entity)
		this.changes.createdEntities.clear()
		this.changes.removedEntities.clear()
	}

	private add(entityId: Id) {
		this.state.entities.push(entityId)
		for (const behaviour of this.config.typeBehaviours.get(BaseState.typeOf(entityId)))
			this.behaviourLists.get(behaviour).push(entityId)
	}

	private fullyRemove(entityId: Id) {
		this.state.entities.remove(entityId)
		this.changes.createdEntities.remove(entityId)
		this.state.entityValues.removeValuesFor(entityId)
		this.changes.updatedEntityValues.removeValuesFor(entityId)
		for (const behaviour of this.config.typeBehaviours.get(BaseState.typeOf(entityId)))
			this.behaviourLists.get(behaviour).remove(entityId)
	}

	*[Symbol.iterator]() {
		for (const entity of this.state.entities)
			yield entity
	}
}
