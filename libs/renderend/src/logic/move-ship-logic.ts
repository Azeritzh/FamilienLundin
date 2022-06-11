import { GameLogic } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { RenderendConstants } from "../renderend-constants"
import { Behaviour, RenderendEntities, RenderendEntityValues } from "../state/entity-values"
import { Globals } from "../state/globals"
import { MoveShipHorisontallyAction, MoveShipVerticallyAction, RenderendAction } from "../state/renderend-action"

export class MoveShipLogic implements GameLogic<RenderendAction> {
	constructor(
		private constants: RenderendConstants,
		private globals: Globals,
		private entities: RenderendEntities,
		private velocity: RenderendEntityValues<Vector2>,
	) { }

	update(actions: RenderendAction[]) {
		if (!this.globals.isAlive)
			return
		this.globals.distanceTravelled += this.globals.speed
		for (const action of actions)
			if (action instanceof MoveShipHorisontallyAction)
				this.changeHorisontalSpeed(action)
			else if (action instanceof MoveShipVerticallyAction)
				this.changeVerticalSpeed(action)
	}

	private changeHorisontalSpeed(action: MoveShipHorisontallyAction) {
		this.globals.speed += action.speed
		if (this.globals.speed < this.constants.minHorisontalSpeed)
			this.globals.speed = 0.1
		if (this.constants.maxHorisontalSpeed < this.globals.speed)
			this.globals.speed = 0.5
	}

	private changeVerticalSpeed(action: MoveShipVerticallyAction) {
		const absoluteSpeed = Math.abs(action.speed)
		const sign = Math.sign(action.speed)
		const speed = sign * Math.min(1, absoluteSpeed) * this.constants.maxVerticalSpeed
		for (const entity of this.entities.with(Behaviour.Ship))
			this.velocity.setFor(entity, new Vector2(0, speed))
	}
}
