import { EntityManager, GameLogic, TerrainManager } from "@lundin/age"
import { Block } from "../state/block"
import { EntityValues } from "../state/entity-values"
import { GameUpdate } from "../state/game-update"
import { GameState } from "../state/game-state"

export class UpdateStateLogic implements GameLogic<GameUpdate> {
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