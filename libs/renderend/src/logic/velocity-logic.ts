import { GameLogic, Id, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { RenderendAction } from "../state/renderend-action"
import { RenderendEntities } from "../state/renderend-entities"

export class VelocityLogic implements GameLogic<RenderendAction> {
	constructor(
		private entities: RenderendEntities,
		private position: ValueGetter<Vector2>,
		private setPosition: ValueSetter<Vector2>,
	) { }

	update() {
		for (const [entity, velocity] of this.entities.with.velocity)
			this.updateEntity(entity, velocity)
	}

	private updateEntity(entity: Id, velocity: Vector2) {
		if (velocity.isZero())
			return
		const position = this.position.of(entity)
		this.setPosition.for(entity, position.add(velocity))
	}
}
