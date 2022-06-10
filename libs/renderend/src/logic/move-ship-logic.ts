import { GameLogic } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { Behaviour, RenderendEntities, RenderendEntityValues } from "../state/entity-values"
import { Globals } from "../state/globals"
import { MoveShipHorisontallyAction, MoveShipVerticallyAction, RenderendAction } from "../state/renderend-action"

export class MoveShipLogic implements GameLogic<RenderendAction> {
	constructor(
		private globals: Globals,
		private entities: RenderendEntities,
		private velocity: RenderendEntityValues<Vector2>,
	) { }

	update(actions: RenderendAction[]) {
		for (const action of actions)
			if (action instanceof MoveShipHorisontallyAction)
				this.changeHorisontalSpeed(action)
			else if (action instanceof MoveShipVerticallyAction)
				this.changeVerticalSpeed(action)
	}

	private changeHorisontalSpeed(action: MoveShipHorisontallyAction) {
		this.globals.speed += action.speed
		if (this.globals.speed < 0.1)
			this.globals.speed = 0.1
		if (0.5 < this.globals.speed)
			this.globals.speed = 0.5
		for (const entity of this.entities.with(Behaviour.Obstacle))
			this.velocity.setFor(entity, new Vector2(-this.globals.speed, 0))
	}

	private changeVerticalSpeed(action: MoveShipVerticallyAction) {
		for (const entity of this.entities.with(Behaviour.Ship))
			this.velocity.setFor(entity, new Vector2(0, action.speed))
	}
}
