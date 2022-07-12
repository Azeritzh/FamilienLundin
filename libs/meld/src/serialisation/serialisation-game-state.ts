import { BlockChunk, CircularSize, Id, TypeMap } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { GameConfig } from "../config/game-config"
import { Block } from "../state/block"
import { EntityValues, GroupedEntityValues } from "../state/entity-values"
import { GameState } from "../state/game-state"

export function createGameState(config: GameConfig, state: GameState) {
	return serialiseGameState(state, config)
}

export function readGameState(config: GameConfig, deserialisedJson: any) {
	return gameStateFrom(config, deserialisedJson)
}

interface SerialisableGameState {
	EntityTypeMap: TypeMap
	SolidTypeMap: TypeMap
	NonSolidTypeMap: TypeMap
	Globals: any
	EntityValues: { [id: string]: GroupedEntityValues }
	Chunks: SerialisableBlockChunk[],
	Players: { [playerName: string]: Id }
}

function serialiseGameState(state: GameState, config: GameConfig = null): SerialisableGameState {
	const chunks = []
	for (const [key, value] of state.Chunks)
		chunks.push(serialiseBlockChunk(value, Vector3.parse(key)))
	const entityValues = {}
	for (const [entity] of state.EntityValues.entities)
		entityValues[entity] = state.EntityValues.GroupFor(entity)
	return {
		EntityTypeMap: config?.EntityTypeMap ?? new TypeMap(),
		SolidTypeMap: config?.SolidTypeMap ?? new TypeMap(),
		NonSolidTypeMap: config?.NonSolidTypeMap ?? new TypeMap(),
		Globals: state.Globals,
		EntityValues: entityValues,
		Chunks: chunks,
		Players: Object.fromEntries(state.Players.entries()),
	}
}

function gameStateFrom(config: GameConfig, deserialised: SerialisableGameState) {
	const entityValues = new EntityValues()
	for (const key in deserialised.EntityValues)
		entityValues.AddValuesFrom(+key, groupedEntityValuesFrom(deserialised.EntityValues[key]))

	const chunks = new Map<string, BlockChunk<Block>>()
	for (const chunk of deserialised.Chunks)
		chunks.set(Vector3.stringify(chunk.coords.x, chunk.coords.y, chunk.coords.z), blockChunkFrom(chunk))

	const players = new Map<string, Id>()
	for (const playerId in deserialised.Players)
		players.set(playerId, deserialised.Players[playerId])

	return new GameState(
		deserialised.Globals,
		entityValues,
		chunks,
		players,
	)
}

/*function TypeMapsAreSame( config: GameConfig, deserialised: SerialisableGameState) {
	if (deserialised.EntityTypeMap.Count != config.EntityTypeMap.Count)
		return false;
	if (deserialised.SolidTypeMap.Count != config.SolidTypeMap.Count)
		return false;
	if (deserialised.NonSolidTypeMap.Count != config.NonSolidTypeMap.Count)
		return false;
	foreach (var (key, value) in EntityTypeMap)
		if (!config.EntityTypeMap.ContainsKey(key) || config.EntityTypeMap[key] != value)
			return false;
	foreach (var (key, value) in SolidTypeMap)
		if (!config.SolidTypeMap.ContainsKey(key) || config.SolidTypeMap[key] != value)
			return false;
	foreach (var (key, value) in NonSolidTypeMap)
		if (!config.NonSolidTypeMap.ContainsKey(key) || config.NonSolidTypeMap[key] != value)
			return false;
	return true;
}*/

interface SerialisableBlockChunk {
	size: Vector3
	coords: Vector3
	blocks: number[],
}

function blockChunkFrom(serialised: SerialisableBlockChunk): BlockChunk<Block> {
	return new BlockChunk<Block>(
		serialised.blocks,
		new Vector3(serialised.size.x, serialised.size.y, serialised.size.z),
		new Vector3(serialised.size.x * serialised.coords.x, serialised.size.y * serialised.coords.y, serialised.size.z * serialised.coords.z),
	)
}

function serialiseBlockChunk(chunk: BlockChunk<Block>, coords: Vector3): SerialisableBlockChunk {
	return { size: chunk.chunkSize, coords, blocks: chunk.blocks }
}

function groupedEntityValuesFrom(jsonObject: any) {
	const values: GroupedEntityValues = { ...jsonObject }
	if (jsonObject.Position)
		values.Position = Object.assign(new Vector3(0, 0, 0), jsonObject.Position)
	if (jsonObject.CircularSize)
		values.CircularSize = Object.assign(new CircularSize(0, 0), jsonObject.CircularSize)
	if (jsonObject.Velocity)
		values.Velocity = Object.assign(new Vector3(0, 0, 0), jsonObject.Velocity)
	return values
}
