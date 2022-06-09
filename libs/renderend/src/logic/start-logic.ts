import { GameLogic } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { RenderendConstants } from "../renderend-constants"
import { RenderendEntities, RenderendEntityValues } from "../state/entity-values"
import { RenderendAction, StartGameAction } from "../state/renderend-action"

export class StartLogic implements GameLogic<RenderendAction> {
	constructor(
		private constants: RenderendConstants,
		private entities: RenderendEntities,
		private position: RenderendEntityValues<Vector2>,
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
		this.position.setFor(entity, new Vector2(10, 50))
	}
}