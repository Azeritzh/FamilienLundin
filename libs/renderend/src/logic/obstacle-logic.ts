import { GameLogic, Id, Random } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { RenderendConstants } from "../renderend-constants"
import { Behaviour, RenderendEntities, RenderendEntityValues } from "../state/entity-values"
import { Globals } from "../state/globals"
import { RenderendAction } from "../state/renderend-action"
import { RectangularSize } from "../values/rectangular-size"

export class ObstacleLogic implements GameLogic<RenderendAction> {
	constructor(
		private constants: RenderendConstants,
		private globals: Globals,
		private entities: RenderendEntities,
		private position: RenderendEntityValues<Vector2>,
		private velocity: RenderendEntityValues<Vector2>,
		private rectangularSize: RenderendEntityValues<RectangularSize>,
		private random: Random,
	) { }

	update() {
		for (const entity of this.entities.with(Behaviour.Obstacle))
			if (this.shouldDespawn(entity))
				this.despawnObstacle(entity)
			else
				this.updateSpeed(entity)

		while (this.moreShouldBeSpawned())
			this.spawnNextLine()
	}

	private moreShouldBeSpawned() {
		return this.globals.lastObstacle < this.globals.distanceTravelled + 20
	}

	private spawnNextLine() {
		this.globals.lastObstacle += 1
		const nextPosition = this.globals.lastObstacle - this.globals.distanceTravelled
		this.spawnWallsAt(nextPosition)

		if (this.globals.lastObstacle < 10)
			return
		if (this.globals.lastObstacle < 100 && this.globals.lastObstacle % 2)
			return
		this.spawnObstaclesAt(nextPosition)
	}

	private spawnWallsAt(xPos: number) {
		const size = this.rectangularSize.defaultOf(this.constants.wallType)
		const topEntity = this.entities.create(this.constants.wallType)
		const bottomEntity = this.entities.create(this.constants.wallType)

		this.position.setFor(topEntity, new Vector2(xPos + size.width / 2, 0 + size.height / 2))
		this.position.setFor(bottomEntity, new Vector2(xPos + size.width / 2, 9 + size.height / 2))

		this.velocity.setFor(topEntity, new Vector2(-this.globals.speed, 0))
		this.velocity.setFor(bottomEntity, new Vector2(-this.globals.speed, 0))
	}

	private spawnObstaclesAt(xPos: number) {
		const obstacleType = this.constants.obstacleTypes[0]
		const size = this.rectangularSize.defaultOf(obstacleType)
		const entity = this.entities.create(obstacleType)
		this.position.setFor(entity, new Vector2(xPos + size.width / 2, 1 + this.random.get.int(8) + size.height / 2))
		this.velocity.setFor(entity, new Vector2(-this.globals.speed, 0))
	}

	private shouldDespawn(entity: Id) {
		return this.position.of(entity).x < -1
	}

	private despawnObstacle(entity: Id) {
		this.entities.remove(entity)
	}

	private updateSpeed(entity: Id) {
		this.velocity.setFor(entity, new Vector2(-this.globals.speed, 0))
	}
}
