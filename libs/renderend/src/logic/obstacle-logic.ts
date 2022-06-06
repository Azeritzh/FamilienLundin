import { AgState, GameLogic, Id } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { RenderendConfig } from "../renderend-config"
import { RenderendAction } from "../state/renderend-action"
import { RenderendState } from "../state/renderend-state"
import { Positioning } from "../values/positioning"

export class ObstacleLogic implements GameLogic<RenderendAction> {
	constructor(
		private config: RenderendConfig,
		private state: RenderendState,
	) { }

	update() {
		for (const entity of this.state.entities)
			if (AgState.typeOf(entity) === this.config.constants.obstacleType)
				if (this.shouldDespawn(entity))
					this.despawnObstacle(entity)

		if (this.isTimeToSpawn())
			this.spawnObstacle()
	}

	private isTimeToSpawn() {
		return this.state.tick % 20 === 0
	}

	private spawnObstacle() {
		const entity = this.state.createEntity(this.config.constants.obstacleType)
		this.state.positioning.setFor(entity, new Positioning(new Vector2(200, 30), new Vector2(-1, 0)))
	}

	private shouldDespawn(entity: Id) {
		const positioning = this.state.positioning.of(entity)
		return positioning.position.x < 0
	}

	private despawnObstacle(entity: Id) {
		this.state.entities.remove(entity)
	}
}