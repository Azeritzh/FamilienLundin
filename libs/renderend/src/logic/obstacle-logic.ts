import { GameLogic, Id } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { RenderendConstants } from "../renderend-constants"
import { Behaviour, RenderendEntities, RenderendEntityValues } from "../state/entity-values"
import { RenderendAction } from "../state/renderend-action"
import { RenderendState } from "../state/renderend-state"

export class ObstacleLogic implements GameLogic<RenderendAction> {
	constructor(
		private constants: RenderendConstants,
		private state: RenderendState,
		private entities: RenderendEntities,
		private position: RenderendEntityValues<Vector2>,
		private velocity: RenderendEntityValues<Vector2>,
	) { }

	update() {
		for (const entity of this.entities.with(Behaviour.Obstacle))
			if (this.shouldDespawn(entity))
				this.despawnObstacle(entity)

		if (this.isTimeToSpawn())
			this.spawnObstacle()
	}

	private isTimeToSpawn() {
		return this.state.tick % 20 === 0
	}

	private spawnObstacle() {
		const entity = this.entities.create(this.constants.obstacleType)
		this.position.setFor(entity, new Vector2(200, 30))
		this.velocity.setFor(entity, new Vector2(-1, 0))
	}

	private shouldDespawn(entity: Id) {
		return this.position.of(entity).x < 0
	}

	private despawnObstacle(entity: Id) {
		this.entities.remove(entity)
	}
}