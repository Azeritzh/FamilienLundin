import { GameLogic } from "@lundin/age"
import { RenderendAction } from "../state/renderend-action"
import { RenderendEntities } from "../state/renderend-entities"
import { RenderendState } from "../state/renderend-state"

export class UpdateStateLogic implements GameLogic<RenderendAction> {
	constructor(
		private state: RenderendState,
		private entities: RenderendEntities,
	) { }

	update() {
		this.state.globals.tick++
		this.entities.applyUpdatedValues()
	}
}