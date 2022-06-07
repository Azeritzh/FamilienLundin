import { BaseState, GameLogic, Id } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { RenderendConstants } from "../renderend-constants"
import { RenderendEntities, RenderendEntityValues } from "../state/entity-values"
import { MoveShipAction, RenderendAction } from "../state/renderend-action"
import { Positioning } from "../values/positioning"

export class MoveShipLogic implements GameLogic<RenderendAction> {
	constructor(
		private constants: RenderendConstants,
		private positioning: RenderendEntityValues<Positioning>,
		private entities: RenderendEntities,
	) { }

	update(actions: RenderendAction[]) {
		for (const action of actions)
			if (action instanceof MoveShipAction)
				this.changeSpeed(action)
	}

	private changeSpeed(action: MoveShipAction) {
		for (const entity of this.entities)
			if (BaseState.typeOf(entity) === this.constants.obstacleType)
				this.updateHorisontalSpeed(entity, action.horisontalSpeed)
		for (const entity of this.entities)
			if (BaseState.typeOf(entity) === this.constants.shipType)
				this.updateVerticalSpeed(entity, action.verticalSpeed)
	}

	private updateHorisontalSpeed(entity: Id, speed: number) {
		const positioning = this.positioning.currentlyOf(entity)
		const newPositioning = positioning.with(null, positioning.velocity.add(new Vector2(-speed, 0)))
		this.positioning.setFor(entity, newPositioning)
	}

	private updateVerticalSpeed(entity: Id, speed: number) {
		const positioning = this.positioning.currentlyOf(entity)
		const newPositioning = positioning.with(null, positioning.velocity.add(new Vector2(0, speed)))
		this.positioning.setFor(entity, newPositioning)
	}
}
