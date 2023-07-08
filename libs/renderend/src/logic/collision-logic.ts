import { Box2d, GameLogic, Id, RectangularSize, ValueGetter } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { RenderendAction } from "../state/renderend-action"
import { RenderendEntities } from "../state/renderend-entities"

export class CollisionLogic implements GameLogic<RenderendAction> {
	constructor(
		private entities: RenderendEntities,
		private position: ValueGetter<Vector2>,
		public listeners: CollisionListener[] = [],
	) { }

	Update() {
		for (const [entity, position] of this.entities.With.position)
			for (const [otherEntity, size] of this.entities.With.rectangularSize)
				if (this.collides(entity, position, otherEntity, size))
					this.notify(entity, otherEntity)
	}

	private collides(entity: Id, point: Vector2, otherEntity: Id, size: RectangularSize) {
		if (entity === otherEntity)
			return false
		const otherPosition = this.position.Of(otherEntity)
		if (!otherPosition)
			return false
		return Box2d.from(otherPosition, size).contains(point)
	}

	private notify(entity: Id, otherEntity: Id) {
		for (const listener of this.listeners) {
			listener.onCollision(entity, otherEntity)
			listener.onCollision(otherEntity, entity)
		}
	}
}

export interface CollisionListener {
	onCollision: (entity: Id, otherEntity: Id) => void
}
