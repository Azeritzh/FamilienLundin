import { GameLogic, TerrainManager } from "@lundin/age"
import { Block } from "../state/block"
import { GameState } from "../state/game-state"
import { GameUpdate, LoadState } from "../state/game-update"

export class LoadStateLogic implements GameLogic<GameUpdate> {
	constructor(
		private State: GameState,
		private Terrain: TerrainManager<Block>,
	) { }

	update(updates: GameUpdate[]) {
		const update = updates.find(x => x instanceof LoadState) as LoadState
		if (!update)
			return

		this.State.LoadFrom(update.State)
		this.Terrain.WorldBounds = this.State.Globals.WorldBounds // TODO: do this differently. See also TerrainManager
	}
}