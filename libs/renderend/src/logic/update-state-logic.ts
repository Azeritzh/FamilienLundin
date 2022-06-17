import { EntityManager, GameLogic } from "@lundin/age"
import { Behaviour, EntityValues } from "../state/entity-values"
import { RenderendAction } from "../state/renderend-action"
import { RenderendState } from "../state/renderend-state"

export class UpdateStateLogic implements GameLogic<RenderendAction> {
	constructor(
		private state: RenderendState,
		private entities: EntityManager<EntityValues, Behaviour>,
	) { }

	update() {
		this.state.globals.tick++
		this.entities.applyUpdatedValues()
	}
}