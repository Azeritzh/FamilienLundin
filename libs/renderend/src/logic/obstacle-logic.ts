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

		while (this.shouldSpawnWalls())
			this.spawnNextWallSegment()
		if (this.shouldSpawnObstacle())
			this.spawnObstacle()
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

	private shouldSpawnWalls() {
		return this.globals.lastWall < this.globals.distanceTravelled + 20
	}

	private spawnNextWallSegment() {
		this.globals.lastWall += 1
		const nextPosition = this.globals.lastWall - this.globals.distanceTravelled
		this.spawnWallsAt(nextPosition)
	}

	private spawnWallsAt(xPos: number) {
		const size = this.rectangularSize.defaultOf(this.constants.wallType)
		this.spawnWallAt(xPos, 0, size)
		this.spawnWallAt(xPos, 9, size)
		if (this.random.get.int(2))
			return

		if (this.random.get.int(2))
			this.spawnWallAt(xPos, 1, size)
		else
			this.spawnWallAt(xPos, 8, size)
	}

	private spawnWallAt(xPos: number, yPos: number, wallSize: RectangularSize) {
		const entity = this.entities.create(this.constants.wallType)
		this.position.setFor(entity, new Vector2(xPos + wallSize.width / 2, yPos + wallSize.height / 2))
		this.velocity.setFor(entity, new Vector2(-this.globals.speed, 0))
	}

	private shouldSpawnObstacle() {
		if (!this.globals.isAlive)
			return false
		if (this.globals.lastWall < 10)
			return false
		if (this.globals.lastWall < 100)
			return this.globals.tick % 20 === 0
		if (this.globals.lastWall < 500)
			return this.globals.tick % 10 === 0
		return this.globals.tick % 7 === 0
	}

	private spawnObstacle() {
		const obstacleType = this.random.get.in(this.constants.obstacleTypes)
		const obstacleHeight = this.rectangularSize.defaultOf(obstacleType).height
		const entity = this.entities.create(obstacleType)
		this.position.setFor(entity, new Vector2(20 + this.random.get.float(2), 1 + this.random.get.float(7 - obstacleHeight) + obstacleHeight))
		this.velocity.setFor(entity, new Vector2(-this.globals.speed, 0))
	}
}
