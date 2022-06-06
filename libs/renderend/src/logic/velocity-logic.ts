import { GameLogic, Id } from "@lundin/age"
import { RenderendAction } from "../state/renderend-action"
import { RenderendState } from "../state/renderend-state"

export class VelocityLogic implements GameLogic<RenderendAction> {
	constructor(
		private state: RenderendState,
	) { }

	update() {
		for (const entity of this.state.entities)
			this.updateEntity(entity)
	}

	private updateEntity(entity: Id) {
		const positioning = this.state.positioning.of(entity)
		if (!positioning.hasVelocity())
			return
		const newPositioning = positioning.with(positioning.position.add(positioning.velocity))
		this.state.positioning.setFor(entity, newPositioning)
	}
}
