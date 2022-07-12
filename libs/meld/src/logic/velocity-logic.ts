import { GameLogic, Id, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Constants } from "../config/constants"
import { MeldEntities } from "../state/entity-values"
import { GameUpdate } from "../state/game-update"

export class VelocityLogic implements GameLogic<GameUpdate> {
	constructor(
		private Constants: Constants,
		private Entities: MeldEntities,
		private Position: ValueGetter<Vector3>,
		private SetPosition: ValueSetter<Vector3>,
		private Velocity: ValueGetter<Vector3>,
		private SetVelocity: ValueSetter<Vector3>,
	) { }

	update() {
		for (const [entity, _] of this.Entities.with.Velocity)
			this.updateEntity(entity)
	}

	private updateEntity(entity: Id) {
		const velocity = this.Velocity.currentlyOf(entity)
		if (!velocity || velocity.isZero())
			return
		const cappedVelocity = this.cappedVelocity(velocity)
		const position = this.Position.currentlyOf(entity)
		this.SetPosition.for(entity, position.add(cappedVelocity))
		this.SetVelocity.for(entity, cappedVelocity)
	}

	private cappedVelocity(velocity: Vector3) {
		if (this.Constants.TerminalVerticalVelocity >= Math.abs(velocity.z))
			return velocity
		return new Vector3(
			velocity.x,
			velocity.y,
			velocity.z = Math.sign(velocity.z) * this.Constants.TerminalVerticalVelocity
		)
	}
}
