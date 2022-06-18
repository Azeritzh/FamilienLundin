import { Box, GameLogic, Id, RectangularSize, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { Behaviour, RenderendEntities } from "../state/entity-values"
import { Globals } from "../state/globals"
import { RenderendAction } from "../state/renderend-action"

export class DieOnCollisionLogic implements GameLogic<RenderendAction> {
	constructor(
		private globals: Globals,
		private entities: RenderendEntities,
		private position: ValueGetter<Vector2>,
		private rectangularSize: ValueGetter<RectangularSize>,
		private setVelocity: ValueSetter<Vector2>,
	) { }

	update() {
		for (const entity of this.entities.with(Behaviour.DieOnCollision))
			this.updateEntity(entity)
	}

	private updateEntity(entity: Id) {
		if (!this.hasCollision(entity))
			return
		this.globals.speed = 0
		this.globals.isAlive = false
		this.setVelocity.setFor(entity, new Vector2(0, 0))
	}

	private hasCollision(entity: Id) {
		for (const otherEntity of this.entities.with(Behaviour.HasRectangularSize)) {
			const box = Box.from(this.position.of(otherEntity), this.rectangularSize.of(otherEntity))
			if (box.contains(this.position.of(entity)))
				return true
		}
		return false
	}
}
