import { BlockChunk, Id } from "@lundin/age"
import { Block } from "./block"
import { EntityValues } from "./entity-values"
import { Globals } from "./globals"

export class GameState {
	constructor(
		public readonly globals: Globals,
		public readonly entityValues: EntityValues,
		public readonly chunks = new Map<string, BlockChunk<Block>>(), // Optimally the key would be a Vector3, but it'll use the object reference, so we instead convert it to a string: 1,2,3
		public readonly players = new Map<string, Id>()
	) { }

	getNewId() {
		return this.globals.nextId++
	}

	loadFrom(state: GameState) {
		this.globals.tick = state.globals.tick
		this.globals.seed = state.globals.seed
		this.globals.nextId = state.globals.nextId

		this.entityValues.clearValues()
		this.entityValues.entities.clear()
		for (const [id, value] of state.entityValues.entities)
			this.entityValues.entities.set(id, value)
		this.entityValues.addValuesFromOther(state.entityValues)

		this.chunks.clear()
		for (const [position, blocks] of state.chunks)
			this.chunks.set(position, blocks)

		this.players.clear()
		for (const [playerId, entityId] of state.players)
			this.players.set(playerId, entityId)
	}
}
