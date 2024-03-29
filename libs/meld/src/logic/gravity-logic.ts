import { GameLogic, Id, TerrainManager, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Constants } from "../config/constants"
import { Block, BlockType, Blocks } from "../state/block"
import { GameUpdate } from "../state/game-update"
import { MeldEntities } from "../state/meld-entities"
import { Region } from "../state/region"

export class GravityLogic implements GameLogic<GameUpdate> {
	constructor(
		private Constants: Constants,
		private Entities: MeldEntities,
		private Terrain: TerrainManager<Block, Region>,
		private Position: ValueGetter<Vector3>,
		private Velocity: ValueGetter<Vector3>,
		private SetVelocity: ValueSetter<Vector3>,
	) { }

	Update() {
		for (const [entity] of this.Entities.With.GravityBehaviour)
			this.updateEntity(entity)
	}

	private updateEntity(entity: Id) {
		const position = this.Position.CurrentlyOf(entity) ?? Vector3.Zero
		if (this.hasGroundAt(position))
			return

		const velocity = this.Velocity.CurrentlyOf(entity) ?? Vector3.Zero
		const newVelocity = velocity.withZ(velocity.z - this.Constants.GravityAcceleration)
		this.SetVelocity.For(entity, newVelocity)
	}

	private hasGroundAt(position: Vector3) {
		if (position.z < Math.floor(position.z) + this.Constants.CollisionAreaWidth)
			return this.isInOrAboveSolidBlock(position)

		if (position.z < Math.floor(position.z) + 0.5 + this.Constants.CollisionAreaWidth)
			return this.isInHalfOrFullBlock(position)

		return Blocks.TypeOf(this.Terrain.GetAt(position)) == BlockType.Full
	}

	private isInOrAboveSolidBlock(position: Vector3) {
		return Blocks.TypeOf(this.Terrain.GetAt(position)) != BlockType.Empty // TODO: Probably needs different handling of null block
			|| Blocks.TypeOf(this.Terrain.Get(position.x, position.y, position.z - 1)) == BlockType.Full
	}

	private isInHalfOrFullBlock(position: Vector3) {
		switch (Blocks.TypeOf(this.Terrain.GetAt(position))) {
			case BlockType.Half:
			case BlockType.Full:
				return true
			default:
				return false
		}
	}
}
