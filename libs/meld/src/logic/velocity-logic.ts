import { GameLogic, Id, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Constants } from "../config/constants"
import { GameUpdate } from "../state/game-update"
import { MeldEntities } from "../state/meld-entities"

export class VelocityLogic implements GameLogic<GameUpdate> {
	constructor(
		private Constants: Constants,
		private Entities: MeldEntities,
		private Position: ValueGetter<Vector3>,
		private SetPosition: ValueSetter<Vector3>,
		private Velocity: ValueGetter<Vector3>,
		private SetVelocity: ValueSetter<Vector3>,
	) { }

	Update() {
		for (const [entity, _] of this.Entities.With.Velocity)
			this.UpdateEntity(entity)
	}

	private UpdateEntity(entity: Id) {
		const velocity = this.Velocity.CurrentlyOf(entity)
		if (!velocity || velocity.isZero())
			return
		const cappedVelocity = this.CappedVelocity(velocity)
		const position = this.Position.CurrentlyOf(entity) ?? Vector3.Zero
		this.SetPosition.For(entity, position.add(cappedVelocity))
		this.SetVelocity.For(entity, cappedVelocity)
	}

	private CappedVelocity(velocity: Vector3) {
		if (this.Constants.TerminalVerticalVelocity < Math.abs(velocity.z))
			return new Vector3(
				velocity.x,
				velocity.y,
				velocity.z = Math.sign(velocity.z) * this.Constants.TerminalVerticalVelocity
			)
		return velocity
	}
}
