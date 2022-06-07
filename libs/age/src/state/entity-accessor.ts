import { Id } from "@lundin/age"
import { AgValues } from "./ag-values"
import { BaseChanges } from "./base-changes"
import { BaseConfig } from "./base-config"
import { BaseState } from "./base-state"

export class EntityAccessor <EntityValues extends AgValues, GroupedEntityValues> {
	constructor(
		private config: BaseConfig<GroupedEntityValues>, // this is here in order to make behaviour based lists of entities later
		private state: BaseState<any, any, EntityValues>,
		private changes: BaseChanges<EntityValues>,
	) { }

	public create(type: Id) {
		const id = this.state.nextId | type
		this.state.nextId++
		this.changes.createdEntities.push(id)
		return id
	}

	public remove(...entityId: Id[]) {
		this.changes.removedEntities.push(...entityId)
	}

	*[Symbol.iterator]() {
		for (const entity of this.state.entities)
			yield entity
	}
}
