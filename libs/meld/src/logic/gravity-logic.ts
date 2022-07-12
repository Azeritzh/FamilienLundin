import { GameLogic, Id, TerrainManager, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Constants } from "../config/constants"
import { Block, Blocks, BlockType } from "../state/block"
import { MeldEntities } from "../state/entity-values"
import { GameUpdate } from "../state/game-update"

export class GravityLogic implements GameLogic<GameUpdate> {
	constructor(
		private Constants: Constants,
		private Entities: MeldEntities,
		private Terrain: TerrainManager<Block>,
		private Position: ValueGetter<Vector3>,
		private Velocity: ValueGetter<Vector3>,
		private SetVelocity: ValueSetter<Vector3>,
	) { }

	update() {
		for (const [entity] of this.Entities.with.GravityBehaviour)
			this.updateEntity(entity)
	}

	private updateEntity(entity: Id) {
		const position = this.Position.currentlyOf(entity) ?? new Vector3(0, 0, 0)
		if (this.hasGroundAt(position))
			return

		const velocity = this.Velocity.currentlyOf(entity) ?? new Vector3(0, 0, 0)
		const newVelocity = velocity.withZ(velocity.z - this.Constants.GravityAcceleration)
		this.SetVelocity.for(entity, newVelocity)
	}

	private hasGroundAt(position: Vector3) {
		if (position.z < Math.floor(position.z) + this.Constants.CollisionAreaWidth)
			return this.isInOrAboveSolidBlock(position)

		if (position.z < Math.floor(position.z) + 0.5 + this.Constants.CollisionAreaWidth)
			return this.isInHalfOrFullBlock(position)

		return Blocks.TypeOf(this.Terrain.getAt(position)) == BlockType.Full
	}

	private isInOrAboveSolidBlock(position: Vector3) {
		return Blocks.TypeOf(this.Terrain.getAt(position)) != BlockType.Empty // TODO: Probably needs different handling of null block
			|| Blocks.TypeOf(this.Terrain.get(position.x, position.y, position.z - 1)) == BlockType.Full
	}

	private isInHalfOrFullBlock(position: Vector3) {
		switch (Blocks.TypeOf(this.Terrain.getAt(position))) {
			case BlockType.Half:
			case BlockType.Full:
				return true
			default:
				return false
		}
	}
}
