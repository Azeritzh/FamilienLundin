import { GameLogic, Id } from "@lundin/age"
import { Behaviour, RenderendEntities, RenderendEntityValues } from "../state/entity-values"
import { RenderendAction } from "../state/renderend-action"
import { Positioning } from "../values/positioning"

export class VelocityLogic implements GameLogic<RenderendAction> {
	constructor(
		private positioning: RenderendEntityValues<Positioning>,
		private entities: RenderendEntities,
	) { }

	update() {
		for (const entity of this.entities.with(Behaviour.Velocity))
			this.updateEntity(entity)
	}

	private updateEntity(entity: Id) {
		const positioning = this.positioning.of(entity)
		if (!positioning.hasVelocity())
			return
		const newPositioning = positioning.with(positioning.position.add(positioning.velocity))
		this.positioning.setFor(entity, newPositioning)
	}
}
