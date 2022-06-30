import { GameLogic, Id, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector2, Vector3 } from "@lundin/utility"
import { Constants } from "../config/constants"
import { MeldAction, MovementAction } from "../state/meld-action"

export class MovementLogic implements GameLogic<MeldAction> {
	constructor(
		private constants: Constants,
		private velocity: ValueGetter<Vector3>,
		private setVelocity: ValueSetter<Vector3>,
	) { }

	update(actions: MeldAction[]) {
		for (const action of actions)
			if (action instanceof MovementAction)
				this.move(action.entity, action.velocity)
	}

	private move(entity: Id, velocity: Vector2) {
		const cappedVelocity = velocity.lengthSquared() > 1
			? velocity.unitVector().multiply(this.constants.maxMoveSpeed)
			: velocity.multiply(this.constants.maxMoveSpeed)
		const oldVelocity = this.velocity.of(entity) ?? new Vector3(0,0,0)
		const finalVelocity = new Vector3(cappedVelocity.x, cappedVelocity.y, oldVelocity.z)
		this.setVelocity.for(entity, finalVelocity)
	}
}
