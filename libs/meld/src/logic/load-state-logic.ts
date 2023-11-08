import { EntityTypeOf, GameLogic, Random, TerrainManager } from "@lundin/age"
import { Block } from "../state/block"
import { GameState } from "../state/game-state"
import { GameUpdate, LoadRegion, LoadState } from "../state/game-update"
import { Region } from "../state/region"

export class LoadStateLogic implements GameLogic<GameUpdate> {
	constructor(
		private State: GameState,
		private Terrain: TerrainManager<Block, Region>,
		private Random: Random,
	) { }

	Update(updates: GameUpdate[]) {
		for (const update of updates) {
			if (update instanceof LoadState)
				this.LoadState(update)
			else if (update instanceof LoadRegion)
				this.LoadRegion(update)
		}
	}

	LoadState(loadState: LoadState) {
		this.State.LoadFrom(loadState.State)
		this.Terrain.WorldBounds = this.State.Globals.WorldBounds // TODO: do this differently. See also TerrainManager
	}

	LoadRegion(loadRegion: LoadRegion) {
		const region = loadRegion.Region
		const State = this.State
		const coords = region.RegionCoords().stringify()
		State.Regions.set(coords, region)
		State.EntityValues.AddValuesFromOther(region.EntityValues)
		region.EntityValues.ClearAll()
		for (const [id, values] of region.EntitiesToBeCreated.entries())
			State.EntityValues.AddValuesFrom(State.GetNewId() | EntityTypeOf(id), values) // some day maybe we'll have to remap the ids instead of just ignoring that part
		region.EntitiesToBeCreated.clear()
		// TODO: State.LoadingRegions.Remove(coords)
	}
}
