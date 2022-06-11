import { GameLogic } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { RenderendConstants } from "../renderend-constants"
import { RenderendEntities, RenderendEntityValues } from "../state/entity-values"
import { Globals } from "../state/globals"
import { RenderendAction, StartGameAction } from "../state/renderend-action"

export class StartLogic implements GameLogic<RenderendAction> {
	constructor(
		private constants: RenderendConstants,
		private globals: Globals,
		private entities: RenderendEntities,
		private position: RenderendEntityValues<Vector2>,
	) { }

	update(actions: RenderendAction[]) {
		if (actions.some(x => x instanceof StartGameAction))
			this.initialiseGame()
	}

	private initialiseGame() {
		this.clearMap()
		this.resetGlobals()
		this.spawnPlayerShip()
	}

	private clearMap() {
		this.entities.remove(...this.entities)
	}

	private resetGlobals() {
		this.globals.speed = 0.1
		this.globals.distanceTravelled = 0
		this.globals.lastObstacle = -1
	}

	private spawnPlayerShip() {
		const entity = this.entities.create(this.constants.shipType)
		this.position.setFor(entity, new Vector2(1, 5))
	}
}