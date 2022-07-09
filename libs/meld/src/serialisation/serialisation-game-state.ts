import { BlockChunk, CircularSize, Id, TypeMap } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { GameConfig } from "../config/game-config"
import { Block } from "../state/block"
import { EntityValues, GroupedEntityValues } from "../state/entity-values"
import { GameState } from "../state/game-state"

export function createGameState(config: GameConfig, state: GameState) {
	return serialiseGameState(state, config)
}

export function readGameState(deserialisedJson: any) {
	return gameStateFrom(deserialisedJson)
}

interface SerialisableGameState {
	entityTypeMap: TypeMap
	solidTypeMap: TypeMap
	nonSolidTypeMap: TypeMap
	globals: any
	entityValues: { [id: string]: GroupedEntityValues }
	chunks: SerialisableBlockChunk[],
	players: { [playerName: string]: Id }
}

function serialiseGameState(state: GameState, config: GameConfig = null) {
	const chunks = []
	for (const [key, value] of state.chunks)
		chunks.push(serialiseBlockChunk(value, Vector3.parse(key)))
	const entityValues = {}
	for (const [entity] of state.entityValues.entities)
		entityValues[entity] = state.entityValues.groupFor(entity)
	return {
		entityTypeMap: config?.entityTypeMap ?? new TypeMap(),
		solidTypeMap: config?.solidTypeMap ?? new TypeMap(),
		nonSolidTypeMap: config?.nonSolidTypeMap ?? new TypeMap(),
		globals: state.globals,
		entityValues: entityValues,
		chunks: chunks,
		players: Object.fromEntries(state.players.entries()),
	}
}

function gameStateFrom(deserialised: SerialisableGameState) {
	const entityValues = new EntityValues()
	for (const key in deserialised.entityValues)
		entityValues.addValuesFrom(+key, groupedEntityValuesFrom(deserialised.entityValues[key]))

	const chunks = new Map<string, BlockChunk<Block>>()
	for (const chunk of deserialised.chunks)
		chunks.set(Vector3.stringify(chunk.coords.x, chunk.coords.y, chunk.coords.z), blockChunkFrom(chunk))

	const players = new Map<string, Id>()
	for (const playerId in deserialised.players)
		players.set(playerId, deserialised.players[playerId])

	return new GameState(
		deserialised.globals,
		entityValues,
		chunks,
		players,
	)
}

interface SerialisableBlockChunk {
	size: Vector3
	coords: Vector3
	blocks: number[],
}

function blockChunkFrom(serialised: SerialisableBlockChunk): BlockChunk<Block> {
	const blocks = serialised.blocks.map(x => Block.deserialise(x))
	return new BlockChunk<Block>(
		blocks,
		new Vector3(serialised.size.x, serialised.size.y, serialised.size.z),
		new Vector3(serialised.size.x * serialised.coords.x, serialised.size.y * serialised.coords.y, serialised.size.z * serialised.coords.z),
	)
}

function serialiseBlockChunk(chunk: BlockChunk<Block>, coords: Vector3): SerialisableBlockChunk {
	const blocks = chunk.blocks.map(x => x.serialise())
	return { size: chunk.chunkSize, coords, blocks }
}

function groupedEntityValuesFrom(jsonObject: any) {
	const values: GroupedEntityValues = { ...jsonObject }
	if (jsonObject.position)
		values.position = Object.assign(new Vector3(0, 0, 0), jsonObject.position)
	if (jsonObject.circularSize)
		values.circularSize = Object.assign(new CircularSize(0, 0), jsonObject.circularSize)
	if (jsonObject.velocity)
		values.velocity = Object.assign(new Vector3(0, 0, 0), jsonObject.velocity)
	return values
}
