import { GameLogic, Id } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { RenderendConstants } from "../renderend-constants"
import { Behaviour, RenderendEntities, RenderendEntityValues } from "../state/entity-values"
import { RenderendAction } from "../state/renderend-action"
import { RenderendState } from "../state/renderend-state"
import { Positioning } from "../values/positioning"

export class ObstacleLogic implements GameLogic<RenderendAction> {
	constructor(
		private constants: RenderendConstants,
		private positioning: RenderendEntityValues<Positioning>,
		private entities: RenderendEntities,
		private state: RenderendState,
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
		this.positioning.setFor(entity, new Positioning(new Vector2(200, 30), new Vector2(-1, 0)))
	}

	private shouldDespawn(entity: Id) {
		const positioning = this.positioning.of(entity)
		return positioning.position.x < 0
	}

	private despawnObstacle(entity: Id) {
		this.entities.remove(entity)
	}
}