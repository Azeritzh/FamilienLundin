import { GameLogic, Id } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { RenderendAction } from "../state/renderend-action"
import { RenderendEntities } from "../state/renderend-entities"

export class DespawnLogic implements GameLogic<RenderendAction> {
	constructor(
		private entities: RenderendEntities,
	) { }

	update() {
		for (const [entity, position] of this.entities.With.position)
			if (this.shouldDespawn(position))
				this.despawn(entity)
	}

	private shouldDespawn(position: Vector2) {
		return position.x < -5 || 40 < position.x
			|| position.y < -5 || 15 < position.y
	}

	private despawn(entity: Id) {
		this.entities.Remove(entity)
	}

}
