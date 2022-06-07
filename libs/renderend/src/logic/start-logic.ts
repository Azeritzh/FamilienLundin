import { GameLogic } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { RenderendConstants } from "../renderend-constants"
import { RenderendEntities, RenderendEntityValues } from "../state/entity-values"
import { RenderendAction, StartGameAction } from "../state/renderend-action"
import { Positioning } from "../values/positioning"

export class StartLogic implements GameLogic<RenderendAction> {
	constructor(
		private constants: RenderendConstants,
		private positioning: RenderendEntityValues<Positioning>,
		private entities: RenderendEntities,
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
		this.entities.remove(...this.entities)
	}

	private spawnPlayerShip(){
		const entity = this.entities.create(this.constants.shipType)
		this.positioning.setFor(entity, new Positioning(new Vector2(10, 50)))
	}
}