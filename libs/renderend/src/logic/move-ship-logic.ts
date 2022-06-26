import { GameLogic, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { RenderendConstants } from "../config/renderend-constants"
import { Globals } from "../state/globals"
import { MoveShipAction, RenderendAction } from "../state/renderend-action"
import { RenderendEntities } from "../state/renderend-entities"

export class MoveShipLogic implements GameLogic<RenderendAction> {
	constructor(
		private constants: RenderendConstants,
		private globals: Globals,
		private entities: RenderendEntities,
		private position: ValueGetter<Vector2>,
		private setVelocity: ValueSetter<Vector2>,
	) { }

	update(actions: RenderendAction[]) {
		if (!this.globals.isAlive)
			return
		this.globals.distanceTravelled += this.globals.speed
		const action = actions.find(x => x instanceof MoveShipAction) as MoveShipAction
		if (action)
			this.changeVelocity(action.velocity)
		else
			this.changeVelocity(new Vector2(0, 0))
	}

	private changeVelocity(velocity: Vector2) {
		const finalVelocity = velocity.lengthSquared() > 1
			? velocity.unitVector().multiply(this.constants.maxVerticalSpeed)
			: velocity.multiply(this.constants.maxVerticalSpeed)

		for (const [entity] of this.entities.with.shipBehaviour) {
			const position = this.position.of(entity)
			if (position.x < 1 && finalVelocity.x < 0)
				finalVelocity.set(0, finalVelocity.y)
			if (position.x > 10 && finalVelocity.x > 0)
				finalVelocity.set(0, finalVelocity.y)
			this.setVelocity.for(entity, finalVelocity)
		}
	}
}
