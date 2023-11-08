import { Id } from "@lundin/age"
import { EntityValues } from "./entity-values"
import { Globals } from "./globals"
import { Region } from "./region"

export class GameState {
	constructor(
		public readonly Globals: Globals,
		public readonly EntityValues: EntityValues,
		public readonly Regions = new Map<string, Region>(), // Optimally the key would be a Vector3, but it'll use the object reference, so we instead convert it to a string: 1,2,3
		public readonly Players = new Map<string, Id>()
		// TODO: Unloaded players
		// TODO: Loading regions
	) { }

	GetNewId() {
		return this.Globals.NextId++
	}

	LoadFrom(state: GameState) {
		this.Globals.Tick = state.Globals.Tick
		this.Globals.Seed = state.Globals.Seed
		this.Globals.NextId = state.Globals.NextId
		this.Globals.WorldBounds = state.Globals.WorldBounds

		this.EntityValues.ClearAll()
		this.EntityValues.AddFromOther(state.EntityValues)

		this.Regions.clear()
		for (const [position, blocks] of state.Regions)
			this.Regions.set(position, blocks)

		this.Players.clear()
		for (const [playerId, entityId] of state.Players)
			this.Players.set(playerId, entityId)

		// no unloading players in this version
	}

	/// <summary>
	/// Loads the given player from the list of unloaded players, if not already loaded.
	/// </summary>
	/// <returns>True if the player was/is loaded, or false if the player does not exist</returns>
	LoadPlayer(player: string) {
		if (this.Players.has(player))
			return true
		return false // normally we check unloaded players, but no such thing in web version
	}

	UnloadPlayer(player: string) {
		console.log("trying to unload" + player)
		return // we don't unload players in web version
	}
}
