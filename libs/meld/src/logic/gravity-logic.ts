import { GameLogic, Id, TerrainManager, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Constants } from "../config/constants"
import { Block, Blocks, BlockType } from "../state/block"
import { MeldEntities } from "../state/entity-values"
import { GameUpdate } from "../state/game-update"

export class GravityLogic implements GameLogic<GameUpdate> {
	constructor(
		private constants: Constants,
		private entities: MeldEntities,
		private terrain: TerrainManager<Block>,
		private position: ValueGetter<Vector3>,
		private velocity: ValueGetter<Vector3>,
		private setVelocity: ValueSetter<Vector3>,
	) { }

	update() {
		for (const [entity] of this.entities.with.gravityBehaviour)
			this.updateEntity(entity)
	}

	private updateEntity(entity: Id) {
		const position = this.position.currentlyOf(entity) ?? new Vector3(0, 0, 0)
		if (this.hasGroundAt(position))
			return

		const velocity = this.velocity.currentlyOf(entity) ?? new Vector3(0, 0, 0)
		const newVelocity = velocity.withZ(velocity.z - this.constants.gravityAcceleration)
		this.setVelocity.for(entity, newVelocity)
	}

	private hasGroundAt(position: Vector3) {
		if (position.z < Math.floor(position.z) + this.constants.collisionAreaWidth)
			return this.isInOrAboveSolidBlock(position)

		if (position.z < Math.floor(position.z) + 0.5 + this.constants.collisionAreaWidth)
			return this.isInHalfOrFullBlock(position)

		return Blocks.TypeOf(this.terrain.getAt(position)) == BlockType.Full
	}

	private isInOrAboveSolidBlock(position: Vector3) {
		return Blocks.TypeOf(this.terrain.getAt(position)) != BlockType.Empty // TODO: Probably needs different handling of null block
			|| Blocks.TypeOf(this.terrain.get(position.x, position.y, position.z - 1)) == BlockType.Full
	}

	private isInHalfOrFullBlock(position: Vector3) {
		switch (Blocks.TypeOf(this.terrain.getAt(position))) {
			case BlockType.Half:
			case BlockType.Full:
				return true
			default:
				return false
		}
	}
}
