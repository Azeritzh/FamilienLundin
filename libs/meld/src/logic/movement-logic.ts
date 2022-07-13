import { GameLogic, Id, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector2, Vector3 } from "@lundin/utility"
import { Constants } from "../config/constants"
import { GameUpdate, MovementAction } from "../state/game-update"
import { MeldEntities } from "../state/meld-entities"

export class MovementLogic implements GameLogic<GameUpdate> {
	constructor(
		private Constants: Constants,
		private Entities: MeldEntities,
		private SetOrientation: ValueSetter<number>,
		private TargetVelocity: ValueGetter<Vector3>,
		private SetTargetVelocity: ValueSetter<Vector3>,
		private Velocity: ValueGetter<Vector3>,
		private SetVelocity: ValueSetter<Vector3>,
	) { }

	update(actions: GameUpdate[]) {
		for (const action of actions)
			if (action instanceof MovementAction)
				this.HandleMovement(action.Entity, action.Velocity)

		for (const [entity] of this.Entities.With.TargetVelocity)
			this.UpdateVelocity(entity)
	}

	private HandleMovement(entity: Id, velocity: Vector2) {
		const movementVelocity = this.GetMovementVelocity(velocity)
		const targetVelocity = new Vector3(movementVelocity.x, movementVelocity.y, 0)
		this.SetTargetVelocity.For(entity, targetVelocity)
		if (targetVelocity.x != 0 || targetVelocity.y != 0)
			this.SetOrientation.For(entity, targetVelocity.getAngle())
	}

	private GetMovementVelocity(velocity: Vector2) {
		return velocity.lengthSquared() > 1
			? velocity.unitVector().multiply(this.Constants.MaxMoveSpeed)
			: velocity.multiply(this.Constants.MaxMoveSpeed)
	}

	private UpdateVelocity(entity: Id) {
		const targetVelocity = this.TargetVelocity.CurrentlyOf(entity) ?? new Vector3(0, 0, 0)
		const oldVelocity = this.Velocity.Of(entity) ?? new Vector3(0, 0, 0)
		if (targetVelocity.x === oldVelocity.x && targetVelocity.y === oldVelocity.y)
			return
		const delta = targetVelocity.subtract(oldVelocity.withZ(0)) // we ignore the z axis, since we only control x and y

		const change = delta.lengthSquared() < this.Constants.Acceleration * this.Constants.Acceleration
			? delta
			: delta.unitVector().multiply(this.Constants.Acceleration)
		this.SetVelocity.For(entity, oldVelocity.add(change))
	}
}
