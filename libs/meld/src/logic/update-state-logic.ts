import { EntityManager, GameLogic, ITerrainManager, Random } from "@lundin/age"
import { Block } from "../state/block"
import { EntityValues } from "../state/entity-values"
import { GameState } from "../state/game-state"
import { GameUpdate } from "../state/game-update"

export class UpdateStateLogic implements GameLogic<GameUpdate> {
	constructor(
		private State: GameState,
		private Entities: EntityManager<EntityValues>,
		private Terrain: ITerrainManager<Block>,
		private Random: Random,
	) { }

	Update() {
		this.State.Globals.Tick++
		this.Entities.ApplyUpdatedValues()
		this.Terrain.ApplyUpdatedValues()
		this.Random.SetSeed(this.State.Globals.Seed + this.State.Globals.Tick)
	}
}
