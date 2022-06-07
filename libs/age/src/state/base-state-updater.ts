import { Id } from "@lundin/age"
import { AgValues } from "./ag-values"
import { BaseChanges } from "./base-changes"
import { BaseState } from "./base-state"

export class BaseStateUpdater<Block, BlockValues extends AgValues, EntityValues extends AgValues> {
	constructor(
		private state: BaseState<Block, BlockValues, EntityValues>,
		private changes: BaseChanges<EntityValues>,
	) { }
	
	public applyUpdatedValues() {
		this.state.entityValues.addValuesFromOther(this.changes.updatedEntityValues)
		this.changes.updatedEntityValues.clear()
		for (const entity of this.changes.createdEntities)
			this.state.entities.push(entity)
		for (const entity of this.changes.removedEntities)
			this.fullyRemove(entity)
		this.changes.createdEntities.clear()
		this.changes.removedEntities.clear()
	}

	private fullyRemove(entityId: Id) {
		this.state.entities.remove(entityId)
		this.changes.createdEntities.remove(entityId)
		this.state.entityValues.removeValuesFor(entityId)
		this.changes.updatedEntityValues.removeValuesFor(entityId)
	}
}
