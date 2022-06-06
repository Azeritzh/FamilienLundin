import { AgState, GameLogic, Id } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { RenderendConfig } from "../renderend-config"
import { MoveShipAction, RenderendAction } from "../state/renderend-action"
import { RenderendState } from "../state/renderend-state"

export class MoveShipLogic implements GameLogic<RenderendAction> {
	constructor(
		private config: RenderendConfig,
		private state: RenderendState,
	) { }

	update(actions: RenderendAction[]) {
		for (const action of actions)
			if (action instanceof MoveShipAction)
				this.changeSpeed(action)
	}

	private changeSpeed(action: MoveShipAction) {
		for (const entity of this.state.entities)
			if (AgState.typeOf(entity) === this.config.constants.obstacleType)
				this.updateHorisontalSpeed(entity, action.horisontalSpeed)
		for (const entity of this.state.entities)
			if (AgState.typeOf(entity) === this.config.constants.shipType)
				this.updateVerticalSpeed(entity, action.verticalSpeed)
	}

	private updateHorisontalSpeed(entity: Id, speed: number) {
		const positioning = this.state.positioning.currentlyOf(entity)
		const newPositioning = positioning.with(null, positioning.velocity.add(new Vector2(-speed, 0)))
		this.state.positioning.setFor(entity, newPositioning)
	}

	private updateVerticalSpeed(entity: Id, speed: number) {
		const positioning = this.state.positioning.currentlyOf(entity)
		const newPositioning = positioning.with(null, positioning.velocity.add(new Vector2(0, speed)))
		this.state.positioning.setFor(entity, newPositioning)
	}
}
