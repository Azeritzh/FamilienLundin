import { GameLogic, Id, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector2, Vector3 } from "@lundin/utility"
import { Constants } from "../config/constants"
import { GameUpdate, MovementAction } from "../state/game-update"

export class MovementLogic implements GameLogic<GameUpdate> {
	constructor(
		private Constants: Constants,
		private Velocity: ValueGetter<Vector3>,
		private SetVelocity: ValueSetter<Vector3>,
	) { }

	update(actions: GameUpdate[]) {
		for (const action of actions)
			if (action instanceof MovementAction)
				this.move(action.Entity, action.Velocity)
	}

	private move(entity: Id, velocity: Vector2) {
		const cappedVelocity = velocity.lengthSquared() > 1
			? velocity.unitVector().multiply(this.Constants.MaxMoveSpeed)
			: velocity.multiply(this.Constants.MaxMoveSpeed)
		const oldVelocity = this.Velocity.of(entity) ?? new Vector3(0,0,0)
		const finalVelocity = new Vector3(cappedVelocity.x, cappedVelocity.y, oldVelocity.z)
		this.SetVelocity.for(entity, finalVelocity)
	}
}
