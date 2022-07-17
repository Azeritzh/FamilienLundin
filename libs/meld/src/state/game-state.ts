import { BlockChunk, Id } from "@lundin/age"
import { Block } from "./block"
import { EntityValues } from "./entity-values"
import { Globals } from "./globals"

export class GameState {
	constructor(
		public readonly Globals: Globals,
		public readonly EntityValues: EntityValues,
		public readonly Chunks = new Map<string, BlockChunk<Block>>(), // Optimally the key would be a Vector3, but it'll use the object reference, so we instead convert it to a string: 1,2,3
		public readonly Players = new Map<string, Id>()
	) { }

	GetNewId() {
		return this.Globals.NextId++
	}

	LoadFrom(state: GameState) {
		this.Globals.Tick = state.Globals.Tick
		this.Globals.Seed = state.Globals.Seed
		this.Globals.NextId = state.Globals.NextId
		this.Globals.WorldBounds = state.Globals.WorldBounds

		this.EntityValues.ClearValues()
		this.EntityValues.Entities.clear()
		for (const [id, value] of state.EntityValues.Entities)
			this.EntityValues.Entities.set(id, value)
		this.EntityValues.AddValuesFromOther(state.EntityValues)

		this.Chunks.clear()
		for (const [position, blocks] of state.Chunks)
			this.Chunks.set(position, blocks)

		this.Players.clear()
		for (const [playerId, entityId] of state.Players)
			this.Players.set(playerId, entityId)
	}
}
