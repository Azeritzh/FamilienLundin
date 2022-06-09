import { GameLogic, Id } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { Behaviour, RenderendEntities, RenderendEntityValues } from "../state/entity-values"
import { Globals } from "../state/globals"
import { MoveShipAction, RenderendAction } from "../state/renderend-action"

export class MoveShipLogic implements GameLogic<RenderendAction> {
	constructor(
		private globals: Globals,
		private entities: RenderendEntities,
		private velocity: RenderendEntityValues<Vector2>,
	) { }

	update(actions: RenderendAction[]) {
		for (const action of actions)
			if (action instanceof MoveShipAction)
				this.changeSpeed(action)
	}

	private changeSpeed(action: MoveShipAction) {
		this.globals.speed += action.horisontalSpeed
		for (const entity of this.entities.with(Behaviour.Obstacle))
			this.updateHorisontalSpeed(entity)
		for (const entity of this.entities.with(Behaviour.Ship))
			this.updateVerticalSpeed(entity, action.verticalSpeed)
	}

	private updateHorisontalSpeed(entity: Id) {
		this.velocity.setFor(entity, new Vector2(-this.globals.speed, 0))
	}

	private updateVerticalSpeed(entity: Id, speed: number) {
		const newVelocity = this.velocity.of(entity).add(new Vector2(0, speed))
		this.velocity.setFor(entity, newVelocity)
	}
}
