import { BlockChunk, Box, CircularSize, Id, TypeMap } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { GameConfig } from "../config/game-config"
import { Block, Blocks } from "../state/block"
import { EntityValues, GroupedEntityValues } from "../state/entity-values"
import { GameState } from "../state/game-state"
import { Item } from "../state/item"
import { DashState } from "../values/dash-state"
import { SelectableItems } from "../values/selectable-items"
import { SelectableTools } from "../values/selectable-tools"
import { ToPascalCase } from "./serialisation-display-config"

export function createGameState(config: GameConfig, state: GameState) {
	return serialiseGameState(state, config)
}

export function readGameState(config: GameConfig, deserialisedJson: any) {
	return gameStateFrom(config, deserialisedJson)
}

interface SerialisableGameState {
	EntityTypeMap: [string, number][]
	SolidTypeMap: [string, number][]
	NonSolidTypeMap: [string, number][]
	ItemTypeMap: [string, number][]
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
	for (const [entity] of state.EntityValues.Entities)
		entityValues[entity] = state.EntityValues.GroupFor(entity)
	return {
		EntityTypeMap: [...config?.EntityTypeMap.Types.entries() ?? []],
		SolidTypeMap: [...config?.SolidTypeMap.Types.entries() ?? []],
		NonSolidTypeMap: [...config?.NonSolidTypeMap.Types.entries() ?? []],
		ItemTypeMap: [...config?.ItemTypeMap.Types.entries() ?? []],
		Globals: state.Globals,
		EntityValues: entityValues,
		Chunks: chunks,
		Players: Object.fromEntries(state.Players.entries()),
	}
}

function gameStateFrom(config: GameConfig, deserialised: SerialisableGameState) {
	const entityTypeMap = new TypeMap(new Map(deserialised.EntityTypeMap))
	const solidTypeMap = new TypeMap(new Map(deserialised.SolidTypeMap))
	const nonSolidTypeMap = new TypeMap(new Map(deserialised.NonSolidTypeMap))
	const itemTypeMap = new TypeMap(new Map(deserialised.ItemTypeMap))

	if (TypeMapsAreSame(config, entityTypeMap, solidTypeMap, nonSolidTypeMap, itemTypeMap))
		return UnadjustedGameStateFrom(deserialised)

	// const entityMap = CreateMapping(deserialised.EntityTypeMap, config.EntityTypeMap)
	const solidMap = CreateMapping(solidTypeMap, config.SolidTypeMap)
	const nonSolidMap = CreateMapping(nonSolidTypeMap, config.NonSolidTypeMap)
	const itemMap = CreateMapping(itemTypeMap, config.ItemTypeMap)

	const entityValues = new EntityValues()
	for (const key in deserialised.EntityValues)
		entityValues.AddValuesFrom(+key, MapValues(groupedEntityValuesFrom(deserialised.EntityValues[key]), solidMap, itemMap))

	const chunks = new Map<string, BlockChunk<Block>>()
	for (const chunk of deserialised.Chunks)
		chunks.set(Vector3.stringify(chunk.coords.x, chunk.coords.y, chunk.coords.z), BlockChunkFrom(solidMap, nonSolidMap, chunk))

	const players = new Map<string, Id>()
	for (const playerId in deserialised.Players)
		players.set(playerId, deserialised.Players[playerId])

	return new GameState(
		readGlobals(deserialised.Globals),
		entityValues,
		chunks,
		players,
	)
}

function readGlobals(deserialised: any) {
	const globals = ToPascalCase(deserialised)
	if (globals.WorldBounds)
		globals.WorldBounds = Object.assign(new Box(0, 0, 0, 0, 0, 0), globals.WorldBounds)
	return globals
}

function UnadjustedGameStateFrom(deserialised: SerialisableGameState) {
	const entityValues = new EntityValues()
	for (const key in deserialised.EntityValues)
		entityValues.AddValuesFrom(+key, groupedEntityValuesFrom(deserialised.EntityValues[key]))

	const chunks = new Map<string, BlockChunk<Block>>()
	for (const chunk of deserialised.Chunks)
		chunks.set(Vector3.stringify(chunk.coords.x, chunk.coords.y, chunk.coords.z), UnadjustedBlockChunkFrom(chunk))

	const players = new Map<string, Id>()
	for (const playerId in deserialised.Players)
		players.set(playerId, deserialised.Players[playerId])

	return new GameState(
		readGlobals(deserialised.Globals),
		entityValues,
		chunks,
		players,
	)
}

function TypeMapsAreSame(config: GameConfig, entityTypeMap: TypeMap, solidTypeMap: TypeMap, nonSolidTypeMap: TypeMap, itemTypeMap: TypeMap) {
	if (entityTypeMap.Types.size != config.EntityTypeMap.Types.size)
		return false
	if (solidTypeMap.Types.size != config.SolidTypeMap.Types.size)
		return false
	if (nonSolidTypeMap.Types.size != config.NonSolidTypeMap.Types.size)
		return false
	if (itemTypeMap.Types.size != config.ItemTypeMap.Types.size)
		return false
	for (const [key, value] of entityTypeMap.Types)
		if (!config.EntityTypeMap.Types.has(key) || config.EntityTypeMap.TypeIdFor(key) != value)
			return false
	for (const [key, value] of solidTypeMap.Types)
		if (!config.SolidTypeMap.Types.has(key) || config.SolidTypeMap.TypeIdFor(key) != value)
			return false
	for (const [key, value] of nonSolidTypeMap.Types)
		if (!config.NonSolidTypeMap.Types.has(key) || config.NonSolidTypeMap.TypeIdFor(key) != value)
			return false
	for (const [key, value] of itemTypeMap.Types)
		if (!config.ItemTypeMap.Types.has(key) || config.ItemTypeMap.TypeIdFor(key) != value)
			return false
	return true
}

function CreateMapping(mapA: TypeMap, mapB: TypeMap) {
	const mapping = new Map<Id, Id>()
	for (const [key, value] of mapA.Types) {
		if (mapB.Types.has(key))
			mapping.set(value, mapB.TypeIdFor(key))
		else
			mapping.set(value, value) // unknown types are left as is
	}
	return mapping
}

function MapValues(values: GroupedEntityValues, solidMapping: Map<Id, Id>, itemMapping: Map<Id, Id>): GroupedEntityValues {
	if (values.SelectableItems !== null && values.SelectableItems !== undefined)
		UpdateSelectableItems(values.SelectableItems, solidMapping, itemMapping)
	if (values.SelectableTools !== null && values.SelectableTools !== undefined)
		UpdateSelectableTools(values.SelectableTools, solidMapping, itemMapping)
	return values
}

function UpdateSelectableItems(selectableItems: SelectableItems, solidMapping: Map<Id, Id>, itemMapping: Map<Id, Id>) {
	if (selectableItems === null || selectableItems === undefined)
		return null
	for (const item of selectableItems.Items)
		UpdateItem(item, solidMapping, itemMapping)
}

function UpdateSelectableTools(selectableTools: SelectableTools, solidMapping: Map<Id, Id>, itemMapping: Map<Id, Id>) {
	if (selectableTools === null || selectableTools === undefined)
		return null
	for (const item of selectableTools.Items)
		UpdateItem(item, solidMapping, itemMapping)
}

function UpdateItem(item: Item, solidMapping: Map<Id, Id>, itemMapping: Map<Id, Id>) {
	if (!item)
		return
	item.Type = itemMapping.get(item.Type)
	item.Content = solidMapping.get(item.Content)
}

interface SerialisableBlockChunk {
	size: Vector3
	coords: Vector3
	blocks: number[],
}

function BlockChunkFrom(solidMapping: Map<Id, Id>, nonSolidMapping: Map<Id, Id>, serialised: SerialisableBlockChunk): BlockChunk<Block> {
	return new BlockChunk<Block>(
		serialised.blocks.map(x => MapBlock(x, solidMapping, nonSolidMapping)),
		new Vector3(serialised.size.x, serialised.size.y, serialised.size.z),
		new Vector3(serialised.size.x * serialised.coords.x, serialised.size.y * serialised.coords.y, serialised.size.z * serialised.coords.z),
	)
}

function UnadjustedBlockChunkFrom(serialised: SerialisableBlockChunk): BlockChunk<Block> {
	return new BlockChunk<Block>(
		serialised.blocks,
		new Vector3(serialised.size.x, serialised.size.y, serialised.size.z),
		new Vector3(serialised.size.x * serialised.coords.x, serialised.size.y * serialised.coords.y, serialised.size.z * serialised.coords.z),
	)
}

function MapBlock(block: Block, solidMapping: Map<Id, Id>, nonSolidMapping: Map<Id, Id>): Block {
	return Blocks.New(
		Blocks.TypeOf(block),
		solidMapping.get(Blocks.SolidOf(block)),
		nonSolidMapping.get(Blocks.NonSolidOf(block)),
		Blocks.VariantOf(block)
	)
}

function serialiseBlockChunk(chunk: BlockChunk<Block>, coords: Vector3): SerialisableBlockChunk {
	return { size: chunk.ChunkSize, coords, blocks: chunk.Blocks }
}

function groupedEntityValuesFrom(serialised: any) {
	const values: GroupedEntityValues = { ...serialised }
	if (serialised.CircularSize)
		values.CircularSize = Object.assign(new CircularSize(0, 0), serialised.CircularSize)
	if (serialised.DashState)
		values.DashState = Object.assign(new DashState(), serialised.DashState)
	if (serialised.Position)
		values.Position = Object.assign(new Vector3(0, 0, 0), serialised.Position)
	if (serialised.SelectableItems)
		values.SelectableItems = Object.assign(new SelectableItems([]), serialised.SelectableItems)
	if (serialised.SelectableTools)
		values.SelectableTools = Object.assign(new SelectableTools([]), serialised.SelectableTools)
	if (serialised.TargetVelocity)
		values.TargetVelocity = Object.assign(new Vector3(0, 0, 0), serialised.TargetVelocity)
	if (serialised.Velocity)
		values.Velocity = Object.assign(new Vector3(0, 0, 0), serialised.Velocity)
	return values
}
