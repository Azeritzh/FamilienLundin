import { Box, GameLogic, Id, RectangularSize, ValueGetter } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { Behaviour, RenderendEntities } from "../state/entity-values"
import { RenderendAction } from "../state/renderend-action"

export class CollisionLogic implements GameLogic<RenderendAction> {
	constructor(
		private entities: RenderendEntities,
		private position: ValueGetter<Vector2>,
		private rectangularSize: ValueGetter<RectangularSize>,
		private listeners: CollisionListener[]
	) { }

	update() {
		for (const entity of this.entities)
			for (const otherEntity of this.entities.with(Behaviour.HasRectangularSize))
				if (this.collides(entity, otherEntity))
					this.notify(entity, otherEntity)
	}

	private collides(entity: Id, otherEntity: Id) {
		const box = Box.from(this.position.of(otherEntity), this.rectangularSize.of(otherEntity))
		return box.contains(this.position.of(entity))
	}

	private notify(entity: Id, otherEntity: Id) {
		for (const listener of this.listeners)
			listener.onCollision(entity, otherEntity)
	}
}

export interface CollisionListener {
	onCollision: (entity: Id, otherEntity: Id) => void
}
