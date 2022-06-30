import { EntityManager, GameLogic, TerrainManager } from "@lundin/age"
import { Block } from "../state/block"
import { EntityValues } from "../state/entity-values"
import { MeldAction } from "../state/meld-action"
import { GameState } from "../state/game-state"

export class UpdateStateLogic implements GameLogic<MeldAction> {
	constructor(
		private state: GameState,
		private entities: EntityManager<EntityValues>,
		private terrain: TerrainManager<Block>
	) { }

	update() {
		this.state.globals.tick++
		this.entities.applyUpdatedValues()
		this.terrain.applyUpdatedValues()
	}
}