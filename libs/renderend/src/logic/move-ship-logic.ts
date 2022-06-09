import { GameLogic, Id } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { Behaviour, RenderendEntities, RenderendEntityValues } from "../state/entity-values"
import { MoveShipAction, RenderendAction } from "../state/renderend-action"
import { Positioning } from "../values/positioning"

export class MoveShipLogic implements GameLogic<RenderendAction> {
	constructor(
		private positioning: RenderendEntityValues<Positioning>,
		private entities: RenderendEntities,
	) { }

	update(actions: RenderendAction[]) {
		for (const action of actions)
			if (action instanceof MoveShipAction)
				this.changeSpeed(action)
	}

	private changeSpeed(action: MoveShipAction) {
		for (const entity of this.entities.with(Behaviour.Obstacle))
			this.updateHorisontalSpeed(entity, action.horisontalSpeed)
		for (const entity of this.entities.with(Behaviour.Ship))
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
