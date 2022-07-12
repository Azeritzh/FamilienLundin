import { EntityManager, GameLogic, TerrainManager } from "@lundin/age"
import { Block } from "../state/block"
import { EntityValues } from "../state/entity-values"
import { GameUpdate } from "../state/game-update"
import { GameState } from "../state/game-state"

export class UpdateStateLogic implements GameLogic<GameUpdate> {
	constructor(
		private State: GameState,
		private Entities: EntityManager<EntityValues>,
		private Terrain: TerrainManager<Block>
	) { }

	update() {
		this.State.Globals.Tick++
		this.Entities.applyUpdatedValues()
		this.Terrain.applyUpdatedValues()
	}
}