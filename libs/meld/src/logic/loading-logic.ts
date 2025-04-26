import { GameLogic } from "@lundin/age"
import { GridVector } from "@lundin/utility"
import { Constants } from "../config/constants"
import { GameConfig } from "../config/game-config"
import { GameState } from "../state/game-state"
import { GameUpdate } from "../state/game-update"
import { MeldEntities } from "../state/meld-entities"
import { VariationProvider } from "../variation-provider"

export class LoadingLogic implements GameLogic<GameUpdate> {
	constructor(
		private Config: GameConfig,
		private Constants: Constants,
		private State: GameState,
		private Entities: MeldEntities,
		private PersistenceProvider: StateProvider,
		private VariationProvider: VariationProvider,
	) { }

	Update() {
		if (this.State.Globals.Tick % 100 == 0) // TODO: When/how often should this happen?
			return
		// TODO: figure out what should do stuff here
		/*const areLoaded = this.GetRegionsThatAreLoaded()
		const shouldbeLoaded = this.GetRegionsThatShouldBeLoaded()

		const excessiveRegions = areLoaded.Except(shouldbeLoaded)
		const missingRegions = shouldbeLoaded.Except(areLoaded)

		this.LoadRegions(missingRegions)
		this.UnloadRegions(excessiveRegions)*/
	}

	private GetRegionsThatAreLoaded() {
		/*var coords = new SortedSet<GridVector>()
		for (const key of this.State.Regions.keys())
			coords.Add(key)
		for (const key of this.State.LoadingRegions.keys())
			coords.Add(key)
		return coords*/
		return []
	}

	private GetRegionsThatShouldBeLoaded() {
		/*var coords = new SortedSet<GridVector>()
		for (const [entity, _] of this.Entities.With.PlayerBehaviour)
			for (const coord of this.RegionsNear(entity))
				coords.Add(coord)
		return coords*/
		return []
	}

	/*private RegionsNear(entity: Id) {
		const Constants = this.Constants
		var position = this.Entities.Position.Get.CurrentlyOf(entity) ?? new Vector3(0, 0, 0);
		var regionCoords = RegionCoordsFor(Math.floor(position.X), Math.floor(position.Y), Math.floor(position.Z), Constants.RegionSize())
		for (var x = -Constants.ChunkLoadingRadius; x <= Constants.ChunkLoadingRadius; x++)
			for (var y = -Constants.ChunkLoadingRadius; y <= Constants.ChunkLoadingRadius; y++)
				//for (var z = -Constants.ChunkLoadingRadius; z <= Constants.ChunkLoadingRadius; z++)
				yield return new Vector3(regionCoords.X + x, regionCoords.Y + y, regionCoords.Z + 0) // only loading one layer at the moment
	}

	private LoadRegions(regionCoords: GridVector[]) {
		for (const coord of regionCoords) {
			this.PersistenceProvider.RequestRegion(this.Config, coord, this.VariationProvider)
			this.State.LoadingRegions.Add(coord, true)
		}
	}

	private UnloadRegions(regionCoords: GridVector[]) {
		for (const coord of regionCoords) {
			this.PersistenceProvider.SaveRegion(this.Config, this.State.Regions[coord]!) // we've just gotten this coordinate from Regions, so it should be safe, right?
			this.RemoveRegion(coord)
		}
	}*/

	private RemoveRegion(regionCoords: GridVector) {
		this.State.Regions.delete(regionCoords.stringify())
		//foreach (var entity in chunk.Entities)
		//	Entities.Remove(entity.Id);
	}
}

interface StateProvider {
	hej: string
}
