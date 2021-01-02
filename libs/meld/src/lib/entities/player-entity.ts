import { BaseEntity } from "../state/entity"
import { GroupedEntityValues } from "../state/entity-values"
import { MeldState } from "../state/meld-state"

export class PlayerEntity extends BaseEntity {
	// MovementBehaviour,
	// GravityBehaviour,
	// BlockCollisionBehaviour,
	// HasEntitySizeValue,
	// HasHealthVariable {
	constructor(
		public type: number,
		public id: number,
		public playerId: string,
	) {
		super(type, id)
	}

}

export class SerialisedPlayer {
	constructor(
		public type: string,
		public entityId: number,
		public playerId: string,
		public values: GroupedEntityValues,
	) { }

	static from(player: PlayerEntity, state: MeldState) {
		const type = state.typeMapping.EntityTypeMap[player.type]
		if (!type)
			throw new Error("Unknown type id for player " + player.playerId)
		return new SerialisedPlayer(
			type,
			player.id,
			player.playerId,
			state.entities.entityValues.groupFor(player.id))
	}
}