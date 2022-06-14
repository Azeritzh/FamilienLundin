import { BaseValues } from "./base-values"
import { BaseChanges } from "./base-changes"
import { BaseConfig, Id, typeOf } from "./base-config"
import { BaseState } from "./base-state"
import { BaseGlobals } from "./base-globals"

export class EntityManager<EntityValues extends BaseValues, GroupedEntityValues, BehaviourType> {
	constructor(
		private config: BaseConfig<any, GroupedEntityValues, BehaviourType>,
		private state: BaseState<BaseGlobals, any, EntityValues>,
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
		return this.behaviourLists.get(behaviour) ?? []
	}

	public create(type: Id) {
		const id = this.state.globals.nextId | type
		this.state.globals.nextId++
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
		for (const behaviour of this.config.typeBehaviours.get(typeOf(entityId)))
			this.behaviourLists.get(behaviour).push(entityId)
	}

	private fullyRemove(entityId: Id) {
		this.state.entities.remove(entityId)
		this.changes.createdEntities.remove(entityId)
		this.state.entityValues.removeValuesFor(entityId)
		this.changes.updatedEntityValues.removeValuesFor(entityId)
		for (const behaviour of this.config.typeBehaviours.get(typeOf(entityId)))
			this.behaviourLists.get(behaviour).remove(entityId)
	}

	*[Symbol.iterator]() {
		for (const entity of this.state.entities)
			yield entity
	}
}
