import { GameLogic, Id, Random } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { RenderendConstants } from "../renderend-constants"
import { Behaviour, RenderendEntities, RenderendEntityValues } from "../state/entity-values"
import { Globals } from "../state/globals"
import { RenderendAction } from "../state/renderend-action"

export class ObstacleLogic implements GameLogic<RenderendAction> {
	constructor(
		private constants: RenderendConstants,
		private globals: Globals,
		private entities: RenderendEntities,
		private position: RenderendEntityValues<Vector2>,
		private velocity: RenderendEntityValues<Vector2>,
		private random: Random,
	) { }

	update() {
		for (const entity of this.entities.with(Behaviour.Obstacle))
			if (this.shouldDespawn(entity))
				this.despawnObstacle(entity)

		if (this.isTimeToSpawn())
			this.spawnObstacle()
	}

	private isTimeToSpawn() {
		this.globals.distanceToNextObstacle -= this.globals.speed
		if (this.globals.distanceToNextObstacle > 0)
			return false
		this.globals.distanceToNextObstacle += 20
		return true
	}

	private spawnObstacle() {
		const entity = this.entities.create(this.constants.obstacleType)
		this.position.setFor(entity, new Vector2(200, this.random.get.int(100)))
		this.velocity.setFor(entity, new Vector2(-this.globals.speed, 0))
	}

	private shouldDespawn(entity: Id) {
		return this.position.of(entity).x < 0
	}

	private despawnObstacle(entity: Id) {
		this.entities.remove(entity)
	}
}
