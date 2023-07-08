import { GameLogic, TerrainManager } from "@lundin/age"
import { Block } from "../state/block"
import { GameState } from "../state/game-state"
import { GameUpdate, LoadRegion, LoadState } from "../state/game-update"
import { Region } from "../state/region"

export class LoadStateLogic implements GameLogic<GameUpdate> {
	constructor(
		private State: GameState,
		private Terrain: TerrainManager<Block, Region>,
	) { }

	Update(updates: GameUpdate[]) {
		for (const update of updates) {
			if (update instanceof LoadState) {
				this.State.LoadFrom(update.State)
				this.Terrain.WorldBounds = this.State.Globals.WorldBounds // TODO: do this differently. See also TerrainManager
			}
			else if (update instanceof LoadRegion) {
				const coords = update.Region.RegionCoords().stringify()
				this.State.Regions.set(coords, update.Region)
				// TODO: this.State.LoadingRegions.Remove(coords)
			}
		}
	}
}