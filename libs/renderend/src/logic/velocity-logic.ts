import { GameLogic, Id, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { Behaviour, RenderendEntities } from "../state/entity-values"
import { RenderendAction } from "../state/renderend-action"

export class VelocityLogic implements GameLogic<RenderendAction> {
	constructor(
		private entities: RenderendEntities,
		private position: ValueGetter<Vector2>,
		private velocity: ValueGetter<Vector2>,
		private setPosition: ValueSetter<Vector2>,
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
		this.setPosition.setFor(entity, position.add(velocity))
	}
}
