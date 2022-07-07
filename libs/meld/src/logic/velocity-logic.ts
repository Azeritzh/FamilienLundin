import { GameLogic, Id, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Constants } from "../config/constants"
import { MeldEntities } from "../state/entity-values"
import { GameUpdate } from "../state/game-update"

export class VelocityLogic implements GameLogic<GameUpdate> {
	constructor(
		private constants: Constants,
		private entities: MeldEntities,
		private position: ValueGetter<Vector3>,
		private setPosition: ValueSetter<Vector3>,
		private velocity: ValueGetter<Vector3>,
		private setVelocity: ValueSetter<Vector3>,
	) { }

	update() {
		for (const [entity, _] of this.entities.with.velocity)
			this.updateEntity(entity)
	}

	private updateEntity(entity: Id) {
		const velocity = this.velocity.currentlyOf(entity)
		if (!velocity || velocity.isZero())
			return
		const cappedVelocity = this.cappedVelocity(velocity)
		const position = this.position.currentlyOf(entity)
		this.setPosition.for(entity, position.add(cappedVelocity))
		this.setVelocity.for(entity, cappedVelocity)
	}

	private cappedVelocity(velocity: Vector3) {
		if (this.constants.terminalVerticalVelocity >= Math.abs(velocity.z))
			return velocity
		return new Vector3(
			velocity.x,
			velocity.y,
			velocity.z = Math.sign(velocity.z) * this.constants.terminalVerticalVelocity
		)
	}
}
