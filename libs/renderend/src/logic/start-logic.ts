import { GameLogic, ValueSetter } from "@lundin/age"
import { Vector2 } from "@lundin/utility"
import { RenderendConstants } from "../config/renderend-constants"
import { Globals } from "../state/globals"
import { RenderendAction, StartGameAction } from "../state/renderend-action"
import { RenderendChanges } from "../state/renderend-changes"
import { RenderendEntities } from "../state/renderend-entities"

export class StartLogic implements GameLogic<RenderendAction> {
	constructor(
		private constants: RenderendConstants,
		private changes: RenderendChanges,
		private globals: Globals,
		private entities: RenderendEntities,
		private setPosition: ValueSetter<Vector2>,
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
		for (const [entity, add] of this.changes.updatedEntityValues.entities)
			if (add)
				this.entities.remove(entity)
		this.entities.remove(...this.entities)
	}

	private resetGlobals() {
		this.globals.isAlive = true
		this.globals.speed = 0.1
		this.globals.distanceTravelled = 0
		this.globals.lastWall = -1
	}

	private spawnPlayerShip() {
		const entity = this.entities.create(this.constants.shipType)
		this.setPosition.for(entity, new Vector2(1, 5))
	}
}