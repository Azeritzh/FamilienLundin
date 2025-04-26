import { Box, CircularSize, GameLogic, Id, TerrainManager, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Constants } from "../config/constants"
import { Block, BlockType, Blocks } from "../state/block"
import { GameUpdate } from "../state/game-update"
import { MeldEntities } from "../state/meld-entities"
import { Region } from "../state/region"

export class BlockCollisionLogic implements GameLogic<GameUpdate> {
	constructor(
		private Constants: Constants,
		private Entities: MeldEntities,
		private Terrain: TerrainManager<Block, Region>,
		private CircularSize: ValueGetter<CircularSize>,
		private Position: ValueGetter<Vector3>,
		private Velocity: ValueGetter<Vector3>,
		private SetVelocity: ValueSetter<Vector3>,
	) { }

	Update() {
		for (const [entity] of this.Entities.With.BlockCollisionBehaviour)
			this.UpdateEntity(entity)
	}

	private UpdateEntity(entity: Id) {
		const velocity = this.Velocity.CurrentlyOf(entity)
		if (velocity?.isZero() ?? true)
			return
		const newVelocity = this.CollisionVelocityChange(entity, velocity!)
		if (newVelocity)
			this.SetVelocity.For(entity, newVelocity)
	}


	private CollisionVelocityChange(entity: Id, velocity: Vector3) {
		const position = this.Position.CurrentlyOf(entity) ?? Vector3.Zero
		const circularSize = this.CircularSize.CurrentlyOf(entity)
		const area = circularSize
			? Box.OccupiedArea(position, circularSize)
			: Box.From(position)

		const timeToCollisionX = this.RelativeDistanceToCollisionX(area, velocity.x)
		const timeToCollisionY = this.RelativeDistanceToCollisionY(area, velocity.y)
		const timeToCollisionZ = this.RelativeDistanceToCollisionZ(area, velocity.z)

		if (timeToCollisionX >= 1 && timeToCollisionY >= 1 && timeToCollisionZ >= 1)
			return null

		velocity = this.UpdateVelocitiesInOrder(timeToCollisionX, timeToCollisionY, timeToCollisionZ, area, velocity)

		if (velocity == this.Velocity.CurrentlyOf(entity))
			return null
		return velocity
	}

	private RelativeDistanceToCollisionX(occupiedArea: Box, velocity: number) {
		const sideX = velocity > 0
			? occupiedArea.MaxX
			: occupiedArea.MinX
		return this.RelativeDistanceToCollision(sideX, velocity, 1)
	}

	private RelativeDistanceToCollisionY(occupiedArea: Box, velocity: number) {
		const sideY = velocity > 0
			? occupiedArea.MaxY
			: occupiedArea.MinY
		return this.RelativeDistanceToCollision(sideY, velocity, 1)
	}

	private RelativeDistanceToCollisionZ(occupiedArea: Box, velocity: number) {
		const sideZ = velocity > 0
			? occupiedArea.MaxZ
			: occupiedArea.MinZ
		return this.RelativeDistanceToCollision(sideZ, velocity, 0.5)
	}

	private RelativeDistanceToCollision(position: number, velocity: number, collisionInterval: number) {
		const distanceToLowerCollision = position < 0
			? collisionInterval + (position % collisionInterval)
			: position % collisionInterval
		const distanceToNextCollision = velocity < 0
			? distanceToLowerCollision
			: collisionInterval - distanceToLowerCollision
		return distanceToNextCollision / Math.abs(velocity)
	}

	private UpdateVelocitiesInOrder(
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
			velocity = this.UpdateVelocityX(timeToCollisionX, area, velocity)
			if (timeToCollisionY <= timeToCollisionZ) {
				velocity = this.UpdateVelocityY(timeToCollisionY, area, velocity)
				velocity = this.UpdateVelocityZ(timeToCollisionZ, area, velocity)
			}
			else {
				velocity = this.UpdateVelocityZ(timeToCollisionZ, area, velocity)
				velocity = this.UpdateVelocityY(timeToCollisionY, area, velocity)
			}
		}
		else if (timeToCollisionY <= timeToCollisionX && timeToCollisionY <= timeToCollisionZ) {
			velocity = this.UpdateVelocityY(timeToCollisionY, area, velocity)
			if (timeToCollisionX <= timeToCollisionZ) {
				velocity = this.UpdateVelocityX(timeToCollisionX, area, velocity)
				velocity = this.UpdateVelocityZ(timeToCollisionZ, area, velocity)
			}
			else {
				velocity = this.UpdateVelocityZ(timeToCollisionZ, area, velocity)
				velocity = this.UpdateVelocityX(timeToCollisionX, area, velocity)
			}
		}
		else {
			velocity = this.UpdateVelocityZ(timeToCollisionZ, area, velocity)
			if (timeToCollisionX <= timeToCollisionY) {
				velocity = this.UpdateVelocityX(timeToCollisionX, area, velocity)
				velocity = this.UpdateVelocityY(timeToCollisionY, area, velocity)
			}
			else {
				velocity = this.UpdateVelocityY(timeToCollisionY, area, velocity)
				velocity = this.UpdateVelocityX(timeToCollisionX, area, velocity)
			}
		}
		return velocity
	}

	private UpdateVelocityX(timeToCollisionX: number, area: Box, velocity: Vector3) {
		if (timeToCollisionX >= 1)
			return velocity
		const boxAtCollisionPosition = area.TranslateBy(velocity.multiply(timeToCollisionX))
		if (this.CollisionAtX(boxAtCollisionPosition, velocity.x))
			return velocity.withX(this.TruncatedDistance(velocity.x * timeToCollisionX))
		return velocity
	}

	private UpdateVelocityY(timeToCollisionY: number, area: Box, velocity: Vector3) {
		if (timeToCollisionY >= 1)
			return velocity
		const boxAtCollisionPosition = area.TranslateBy(velocity.multiply(timeToCollisionY))
		if (this.CollisionAtY(boxAtCollisionPosition, velocity.y))
			return velocity.withY(this.TruncatedDistance(velocity.y * timeToCollisionY))
		return velocity
	}

	private UpdateVelocityZ(timeToCollisionZ: number, area: Box, velocity: Vector3) {
		if (timeToCollisionZ >= 1)
			return velocity
		const boxAtCollisionPosition = area.TranslateBy(velocity.multiply(timeToCollisionZ))
		if (this.CollisionAtZ(boxAtCollisionPosition, velocity.z))
			return velocity.withZ(this.TruncatedDistance(velocity.z * timeToCollisionZ))
		return velocity
	}

	private TruncatedDistance(remainingDistance: number) {
		if (remainingDistance > this.Constants.CollisionAreaWidth)
			return remainingDistance - this.Constants.CollisionAreaWidth / 8
		if (remainingDistance > -this.Constants.CollisionAreaWidth)
			return 0
		return remainingDistance + this.Constants.CollisionAreaWidth / 8
	}

	private CollisionAtX(area: Box, velocity: number) {
		const x = velocity > 0
			? area.MaxX + 0.5
			: area.MinX - 0.5
		for (const y of this.BlockPositionsY(area)) {
			if (this.IsSolidAtPoint(x, y, area.MinZ))
				return true
			for (const z of this.BlockPositionAboveBottom(area))
				if (this.IsSolidInBlock(x, y, z))
					return true
		}
		return false
	}

	private CollisionAtY(area: Box, velocity: number) {
		const y = velocity > 0
			? area.MaxY + 0.5
			: area.MinY - 0.5
		for (const x of this.BlockPositionsX(area)) {
			if (this.IsSolidAtPoint(x, y, area.MinZ))
				return true
			for (const z of this.BlockPositionAboveBottom(area))
				if (this.IsSolidInBlock(x, y, z))
					return true
		}
		return false
	}

	private CollisionAtZ(area: Box, velocity: number) {
		const z = velocity > 0
			? area.MaxZ + 0.5
			: area.MinZ + this.Constants.CollisionAreaWidth / 8
		for (const x of this.BlockPositionsX(area))
			for (const y of this.BlockPositionsY(area))
				if (velocity > 0
					? this.IsSolidInBlock(x, y, z)
					: this.IsSolidGoingDown(x, y, z))
					return true
		return false
	}

	private IsSolidGoingDown(x: number, y: number, z: number) {
		const blockType = Blocks.TypeOf(this.Terrain.Get(x, y, z))
		const zAboveFloor = z < 0 ? 1 + (z % 1) : z % 1
		if (0.5 < zAboveFloor && zAboveFloor < 0.5 + this.Constants.CollisionAreaWidth)
			return blockType == BlockType.Half
		if (0 < zAboveFloor && zAboveFloor < this.Constants.CollisionAreaWidth)
			return blockType == BlockType.Floor || Blocks.TypeOf(this.Terrain.Get(x, y, z - 1)) == BlockType.Full
		return false
	}

	private *BlockPositionsX(area: Box) {
		for (let x = area.MinX; x < area.MaxX; x++)
			yield x
		yield area.MaxX
	}

	private *BlockPositionsY(area: Box) {
		for (let y = area.MinY; y < area.MaxY; y++)
			yield y
		yield area.MaxY
	}

	private *BlockPositionAboveBottom(area: Box) {
		for (let z = area.MinZ + 1; z < area.MaxZ; z++)
			yield z
		if (area.MinZ < Math.floor(area.MaxZ))
			yield area.MaxZ
	}

	private IsSolidAtPoint(x: number, y: number, z: number) {
		const blockType = Blocks.TypeOf(this.Terrain.Get(x, y, z))
		const zAboveFloor = z < 0 ? 1 - (z % 1) : z % 1
		switch (blockType) {
			case BlockType.Empty: return false
			case BlockType.Floor: return false
			case BlockType.Half: return zAboveFloor < 0.5
			case BlockType.Full: return true
		}
	}

	private IsSolidInBlock(x: number, y: number, z: number) {
		return Blocks.HasSolid(this.Terrain.Get(x, y, z))
	}
}