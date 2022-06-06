import { GameLogic } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { RenderendConfig } from "../renderend-config"
import { RenderendAction, StartGameAction } from "../state/renderend-action"
import { RenderendState } from "../state/renderend-state"
import { Positioning } from "../values/positioning"

export class StartLogic implements GameLogic<RenderendAction> {
	constructor(
		private config: RenderendConfig,
		private state: RenderendState,
	) { }

	update(actions: RenderendAction[]) {
		if(actions.some(x => x instanceof StartGameAction))
			this.initialiseGame()
	}

	private initialiseGame() {
		this.clearMap()
		this.spawnPlayerShip()
	}

	private clearMap(){
		this.state.entities.removedEntities.push(...this.state.entities)
	}

	private spawnPlayerShip(){
		const entity = this.state.createEntity(this.config.constants.shipType)
		this.state.positioning.setFor(entity, new Positioning(new Vector2(10, 50)))
	}
}