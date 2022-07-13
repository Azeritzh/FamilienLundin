import { Box, CircularSize, GameLogic, Id, TerrainManager, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Constants } from "../config/constants"
import { Block, Blocks, BlockType } from "../state/block"
import { GameUpdate } from "../state/game-update"
import { MeldEntities } from "../state/meld-entities"

export class BlockCollisionLogic implements GameLogic<GameUpdate> {
	constructor(
		private Constants: Constants,
		private Entities: MeldEntities,
		private Terrain: TerrainManager<Block>,
		private CircularSize: ValueGetter<CircularSize>,
		private Position: ValueGetter<Vector3>,
		private Velocity: ValueGetter<Vector3>,
		private SetVelocity: ValueSetter<Vector3>,
	) { }

	update() {
		for (const [entity] of this.Entities.With.BlockCollisionBehaviour)
			this.updateEntity(entity)
	}

	private updateEntity(entity: Id) {
		const velocity = this.Velocity.CurrentlyOf(entity)
		if (velocity?.isZero() ?? true)
			return
		const newVelocity = this.CollisionVelocityChange(entity, velocity)
		if (newVelocity)
			this.SetVelocity.For(entity, newVelocity)
	}


	private CollisionVelocityChange(entity: Id, velocity: Vector3) {
		const position = this.Position.CurrentlyOf(entity) ?? new Vector3(0, 0, 0)
		const circularSize = this.CircularSize.CurrentlyOf(entity)
		const area = circularSize
			? Box.occupiedArea(position, circularSize)
			: Box.from(position)

		const timeToCollisionX = this.relativeDistanceToCollisionX(area, velocity.x)
		const timeToCollisionY = this.relativeDistanceToCollisionY(area, velocity.y)
		const timeToCollisionZ = this.relativeDistanceToCollisionZ(area, velocity.z)

		if (timeToCollisionX >= 1 && timeToCollisionY >= 1 && timeToCollisionZ >= 1)
			return null

		velocity = this.updateVelocitiesInOrder(timeToCollisionX, timeToCollisionY, timeToCollisionZ, area, velocity)

		if (velocity == this.Velocity.CurrentlyOf(entity))
			return null
		return velocity
	}

	private relativeDistanceToCollisionX(occupiedArea: Box, velocity: number) {
		const sideX = velocity > 0
			? occupiedArea.maxX
			: occupiedArea.minX
		return this.relativeDistanceToCollision(sideX, velocity, 1)
	}

	private relativeDistanceToCollisionY(occupiedArea: Box, velocity: number) {
		const sideY = velocity > 0
			? occupiedArea.maxY
			: occupiedArea.minY
		return this.relativeDistanceToCollision(sideY, velocity, 1)
	}

	private relativeDistanceToCollisionZ(occupiedArea: Box, velocity: number) {
		const sideZ = velocity > 0
			? occupiedArea.maxZ
			: occupiedArea.minZ
		return this.relativeDistanceToCollision(sideZ, velocity, 0.5)
	}

	private relativeDistanceToCollision(position: number, velocity: number, collisionInterval: number) {
		const distanceToLowerCollision = position < 0
			? collisionInterval + (position % collisionInterval)
			: position % collisionInterval
		const distanceToNextCollision = velocity < 0
			? distanceToLowerCollision
			: collisionInterval - distanceToLowerCollision
		return distanceToNextCollision / Math.abs(velocity)
	}

	private updateVelocitiesInOrder(
		timeToCollisionX: number,
		timeToCollisionY: number,
		timeToCollisionZ: number,
		area: Box,
		velocity: Vector3,
	) {
		// some pre-mature optimisation: rather than put the results into
		// a list, sorting it, and then handling them in order, we do it
		// manually to avoid the memory allocation overhead.
		if (timeToCollisionX <= timeToCollisionY && timeToCollisionX <= timeToCollisionZ) {
			velocity = this.updateVelocityX(timeToCollisionX, area, velocity)
			if (timeToCollisionY <= timeToCollisionZ) {
				velocity = this.updateVelocityY(timeToCollisionY, area, velocity)
				velocity = this.updateVelocityZ(timeToCollisionZ, area, velocity)
			}
			else {
				velocity = this.updateVelocityZ(timeToCollisionZ, area, velocity)
				velocity = this.updateVelocityY(timeToCollisionY, area, velocity)
			}
		}
		else if (timeToCollisionY <= timeToCollisionX && timeToCollisionY <= timeToCollisionZ) {
			velocity = this.updateVelocityY(timeToCollisionY, area, velocity)
			if (timeToCollisionX <= timeToCollisionZ) {
				velocity = this.updateVelocityX(timeToCollisionX, area, velocity)
				velocity = this.updateVelocityZ(timeToCollisionZ, area, velocity)
			}
			else {
				velocity = this.updateVelocityZ(timeToCollisionZ, area, velocity)
				velocity = this.updateVelocityX(timeToCollisionX, area, velocity)
			}
		}
		else {
			velocity = this.updateVelocityZ(timeToCollisionZ, area, velocity)
			if (timeToCollisionX <= timeToCollisionY) {
				velocity = this.updateVelocityX(timeToCollisionX, area, velocity)
				velocity = this.updateVelocityY(timeToCollisionY, area, velocity)
			}
			else {
				velocity = this.updateVelocityY(timeToCollisionY, area, velocity)
				velocity = this.updateVelocityX(timeToCollisionX, area, velocity)
			}
		}
		return velocity
	}

	private updateVelocityX(timeToCollisionX: number, area: Box, velocity: Vector3) {
		if (timeToCollisionX >= 1)
			return velocity
		const boxAtCollisionPosition = area.translateBy(velocity.multiply(timeToCollisionX))
		if (this.collisionAtX(boxAtCollisionPosition, velocity.x))
			return velocity.withX(this.truncatedDistance(velocity.x * timeToCollisionX))
		return velocity
	}

	private updateVelocityY(timeToCollisionY: number, area: Box, velocity: Vector3) {
		if (timeToCollisionY >= 1)
			return velocity
		const boxAtCollisionPosition = area.translateBy(velocity.multiply(timeToCollisionY))
		if (this.collisionAtY(boxAtCollisionPosition, velocity.y))
			return velocity.withY(this.truncatedDistance(velocity.y * timeToCollisionY))
		return velocity
	}

	private updateVelocityZ(timeToCollisionZ: number, area: Box, velocity: Vector3) {
		if (timeToCollisionZ >= 1)
			return velocity
		const boxAtCollisionPosition = area.translateBy(velocity.multiply(timeToCollisionZ))
		if (this.collisionAtZ(boxAtCollisionPosition, velocity.z))
			return velocity.withZ(this.truncatedDistance(velocity.z * timeToCollisionZ))
		return velocity
	}

	private truncatedDistance(remainingDistance: number) {
		if (remainingDistance > this.Constants.CollisionAreaWidth)
			return remainingDistance - this.Constants.CollisionAreaWidth / 8
		if (remainingDistance > -this.Constants.CollisionAreaWidth)
			return 0
		return remainingDistance + this.Constants.CollisionAreaWidth / 8
	}

	private collisionAtX(area: Box, velocity: number) {
		const x = velocity > 0
			? area.maxX + 0.5
			: area.minX - 0.5
		for (const y of this.blockPositionsY(area)) {
			if (this.isSolidAtPoint(x, y, area.minZ))
				return true
			for (const z of this.blockPositionAboveBottom(area))
				if (this.isSolidInBlock(x, y, z))
					return true
		}
		return false
	}

	private collisionAtY(area: Box, velocity: number) {
		const y = velocity > 0
			? area.maxY + 0.5
			: area.minY - 0.5
		for (const x of this.blockPositionsX(area)) {
			if (this.isSolidAtPoint(x, y, area.minZ))
				return true
			for (const z of this.blockPositionAboveBottom(area))
				if (this.isSolidInBlock(x, y, z))
					return true
		}
		return false
	}

	private collisionAtZ(area: Box, velocity: number) {
		const z = velocity > 0
			? area.maxZ + 0.5
			: area.minZ + this.Constants.CollisionAreaWidth / 8
		for (const x of this.blockPositionsX(area))
			for (const y of this.blockPositionsY(area))
				if (velocity > 0
					? this.isSolidInBlock(x, y, z)
					: this.isSolidGoingDown(x, y, z))
					return true
		return false
	}

	private isSolidGoingDown(x: number, y: number, z: number) {
		const blockType = Blocks.TypeOf(this.Terrain.Get(x, y, z)) ?? BlockType.Empty
		const zAboveFloor = z < 0 ? 1 + (z % 1) : z % 1
		if (0.5 < zAboveFloor && zAboveFloor < 0.5 + this.Constants.CollisionAreaWidth)
			return blockType == BlockType.Half
		if (0 < zAboveFloor && zAboveFloor < this.Constants.CollisionAreaWidth)
			return blockType == BlockType.Floor || Blocks.TypeOf(this.Terrain.Get(x, y, z - 1)) == BlockType.Full
		return false
	}

	private *blockPositionsX(area: Box) {
		for (let x = area.minX; x < area.maxX; x++)
			yield x
		yield area.maxX
	}

	private *blockPositionsY(area: Box) {
		for (let y = area.minY; y < area.maxY; y++)
			yield y
		yield area.maxY
	}

	private *blockPositionAboveBottom(area: Box) {
		for (let z = area.minZ + 1; z < area.maxZ; z++)
			yield z
		if (area.minZ < Math.floor(area.maxZ))
			yield area.maxZ
	}

	private isSolidAtPoint(x: number, y: number, z: number) {
		const blockType = Blocks.TypeOf(this.Terrain.Get(x, y, z)) ?? BlockType.Empty
		const zAboveFloor = z < 0 ? 1 - (z % 1) : z % 1
		switch (blockType) {
			case BlockType.Empty: return false
			case BlockType.Floor: return false
			case BlockType.Half: return zAboveFloor < 0.5
			case BlockType.Full: return true
		}
	}

	private isSolidInBlock(x: number, y: number, z: number) {
		return Blocks.HasSolid(this.Terrain.Get(x, y, z)) ?? false
	}
}