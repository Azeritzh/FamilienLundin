import { GameLogic, ValueSetter } from "@lundin/age"
import { Vector2, Vector3 } from "@lundin/utility"
import { Constants } from "../config/constants"
import { MeldEntities } from "../state/entity-values"
import { MeldAction, MoveAction } from "../state/meld-action"

export class MovementLogic implements GameLogic<MeldAction> {
	constructor(
		private constants: Constants,
		private entities: MeldEntities,
		private setVelocity: ValueSetter<Vector3>,
	) { }

	update(actions: MeldAction[]) {
		const action = actions.find(x => x instanceof MoveAction) as MoveAction
		if (action)
			this.changeVelocity(action.velocity)
		else
			this.changeVelocity(new Vector2(0, 0))
	}

	private changeVelocity(velocity: Vector2) {
		const cappedVelocity = velocity.lengthSquared() > 1
			? velocity.unitVector().multiply(this.constants.maxMoveSpeed)
			: velocity.multiply(this.constants.maxMoveSpeed)
		const finalVelocity = new Vector3(cappedVelocity.x, cappedVelocity.y, 0)

		for (const [entity] of this.entities.with.position)
			this.setVelocity.for(entity, finalVelocity)
	}
}
