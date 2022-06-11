import { GameLogic, Id } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { Behaviour, RenderendEntities, RenderendEntityValues } from "../state/entity-values"
import { RenderendAction } from "../state/renderend-action"

export class VelocityLogic implements GameLogic<RenderendAction> {
	constructor(
		private entities: RenderendEntities,
		private position: RenderendEntityValues<Vector2>,
		private velocity: RenderendEntityValues<Vector2>,
	) { }

	update() {
		for (const entity of this.entities.with(Behaviour.Velocity))
			this.updateEntity(entity)
	}

	private updateEntity(entity: Id) {
		const velocity = this.velocity.of(entity)
		if (velocity.isZero())
			return
		const position = this.position.of(entity)
		this.position.setFor(entity, position.add(velocity))
	}
}
