import { GameLogic, Id, Random, RectangularSize, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { RenderendConstants } from "../config/renderend-constants"
import { Globals } from "../state/globals"
import { RenderendAction } from "../state/renderend-action"
import { RenderendEntities } from "../state/renderend-entities"

export class ObstacleLogic implements GameLogic<RenderendAction> {
	constructor(
		private constants: RenderendConstants,
		private globals: Globals,
		private entities: RenderendEntities,
		private position: ValueGetter<Vector2>,
		private rectangularSize: ValueGetter<RectangularSize>,
		private setPosition: ValueSetter<Vector2>,
		private setVelocity: ValueSetter<Vector2>,
		private random: Random,
	) { }

	Update() {
		for (const [entity] of this.entities.With.obstacleBehaviour)
			this.updateSpeed(entity)

		while (this.shouldSpawnWalls())
			this.spawnNextWallSegment()
		if (this.shouldSpawnObstacle())
			this.spawnObstacle()
		if (this.shouldSpawnAnnoyingObstacle())
			this.spawnAnnoyingObstacle()
	}

	private updateSpeed(entity: Id) {
		this.setVelocity.For(entity, new Vector2(-this.globals.speed, 0))
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
		const size = this.rectangularSize.DefaultOf(this.constants.wallType)
		this.spawnWallAt(xPos, 0, size)
		this.spawnWallAt(xPos, 9, size)
		if (this.random.Int(2))
			return

		if (this.random.Int(2))
			this.spawnWallAt(xPos, 1, size)
		else
			this.spawnWallAt(xPos, 8, size)
	}

	private spawnWallAt(xPos: number, yPos: number, wallSize: RectangularSize) {
		const entity = this.entities.Create(this.constants.wallType)
		this.setPosition.For(entity, new Vector2(xPos + wallSize.Width / 2, yPos + wallSize.Height / 2))
		this.setVelocity.For(entity, new Vector2(-this.globals.speed, 0))
	}

	private shouldSpawnObstacle() {
		if (!this.globals.isAlive)
			return false
		if (this.globals.lastWall < 10)
			return false
		if (this.globals.lastWall < 100)
			return this.globals.tick % this.constants.easyObstacleInterval === 0
		if (this.globals.lastWall < 500)
			return this.globals.tick % this.constants.mediumObstacleInterval === 0
		return this.globals.tick % this.constants.hardObstacleInterval === 0
	}

	private spawnObstacle() {
		const obstacleType = this.random.In(this.constants.obstacleTypes)
		const obstacleHeight = this.rectangularSize.DefaultOf(obstacleType).Height
		this.spawnObstacleAt(
			obstacleType,
			this.random.Float(2),
			1 + this.random.Float(7 - obstacleHeight) + obstacleHeight,
		)
	}

	private shouldSpawnAnnoyingObstacle() {
		return this.globals.tick % this.constants.annoyingObstacleInterval === 0
	}

	private spawnAnnoyingObstacle() {
		const obstacleType = this.random.In(this.constants.obstacleTypes)
		this.spawnObstacleAt(
			obstacleType,
			this.random.Float(2),
			this.getShipHeight(),
		)
	}

	private spawnObstacleAt(type: Id, deltaX: number, y: number) {
		const previousWallX = this.globals.lastWall - this.globals.distanceTravelled
		const entity = this.entities.Create(type)
		this.setPosition.For(entity, new Vector2(previousWallX + Math.floor(deltaX * 16) / 16, y)) // doing the 16 thing to align with pixel grid
		this.setVelocity.For(entity, new Vector2(-this.globals.speed, 0))
	}

	private getShipHeight() {
		for (const [ship] of this.entities.With.shipBehaviour)
			return this.position.Of(ship).y
	}
}
