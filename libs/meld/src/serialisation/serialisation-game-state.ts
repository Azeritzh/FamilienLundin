import { Box, CircularSize, Id, TypeMap } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { GameConfig } from "../config/game-config"
import { Version } from "../config/version"
import { GroupedEntityValues, SerialisableEntities } from "../state/entity-values"
import { GameState } from "../state/game-state"
import { Region, SerialisableBlockChunk, SerialisableRegion } from "../state/region"
import { DashState } from "../values/dash-state"
import { SelectableItems } from "../values/selectable-items"
import { SelectableTools } from "../values/selectable-tools"
import { ToolState } from "../values/tool-state"
import { BlockArea } from "../values/block-area"

export function createGameState(config: GameConfig, state: GameState) {
	return serialiseGameState(state, config)
}

export function readGameState(config: GameConfig, deserialisedJson: any) {
	deserialisedJson.EntityValues
	return gameStateFrom(config, deserialisedJson)
}

class SerialisableGameState {
	constructor(
		public Version: {
			EntityTypeMap: [string, number][]
			SolidTypeMap: [string, number][]
			NonSolidTypeMap: [string, number][]
			ItemTypeMap: [string, number][]
		} = { EntityTypeMap: [], SolidTypeMap: [], NonSolidTypeMap: [], ItemTypeMap: [] },
		public Globals: any = {},
		public EntityValues: { [id: string]: GroupedEntityValues } = {},
		public Regions: SerialisableRegion[] = [],
		public Players: { [playerName: string]: Id } = {},
	) { }

	static fromDeserialised(source: any) {
		const state = new SerialisableGameState()
		Object.assign(state, source)
		for (const key in state.EntityValues)
			state.EntityValues[key] = groupedEntityValuesFrom(state.EntityValues[key])
		for (const index in state.Regions)
			state.Regions[index] = SerialisableRegion.fromDeserialised(state.Regions[index])
		return state
	}
}

function serialiseGameState(state: GameState, config: GameConfig = null): SerialisableGameState {
	const entityValues = {}
	for (const [entity] of state.EntityValues.Entities)
		entityValues[entity] = state.EntityValues.GroupFor(entity)
	return {
		Version: {
			EntityTypeMap: [...config?.EntityTypeMap.Types.entries() ?? []],
			SolidTypeMap: [...config?.SolidTypeMap.Types.entries() ?? []],
			NonSolidTypeMap: [...config?.NonSolidTypeMap.Types.entries() ?? []],
			ItemTypeMap: [...config?.ItemTypeMap.Types.entries() ?? []],
		},
		Globals: state.Globals,
		EntityValues: entityValues,
		Regions: Array.from(state.Regions, ([, value]) => SerialisableRegion.From(value, config)),
		Players: Object.fromEntries(state.Players.entries()),
	}
}

function gameStateFrom(config: GameConfig, deserialised: SerialisableGameState) {
	deserialised.Regions = deserialised.Regions.map(x => Object.assign(new SerialisableRegion(null, null, null, null, null, null, null, null), x))
	for (const region of deserialised.Regions) {
		region.Chunks = region.Chunks.map(x => Object.assign(new SerialisableBlockChunk(null, null, null), x))
		for (const chunk of region.Chunks) {
			chunk.Offset = Object.assign(new Vector3(0, 0, 0), chunk.Offset)
			chunk.Size = Object.assign(new Vector3(0, 0, 0), chunk.Size)
		}
		region.ChunkSize = Object.assign(new Vector3(0, 0, 0), region.ChunkSize)
		region.Offset = Object.assign(new Vector3(0, 0, 0), region.Offset)
		region.Size = Object.assign(new Vector3(0, 0, 0), region.Size)
		region.EntityValues = new Map(Object.entries(region.EntityValues).map(([k, v]) => [+k, v]))
	}

	const version = new Version(
		new TypeMap(new Map(deserialised.Version.EntityTypeMap)),
		new TypeMap(new Map(deserialised.Version.SolidTypeMap)),
		new TypeMap(new Map(deserialised.Version.NonSolidTypeMap)),
		new TypeMap(new Map(deserialised.Version.ItemTypeMap)),
	)
	if (version.SimilarTo(config))
		return UnadjustedGameStateFrom(deserialised)

	const entityMap = version.GetEntityMapping(config)
	const solidMap = version.GetSolidMapping(config)
	//const nonSolidMap = version.GetNonSolidMapping(config)
	const itemMap = version.GetItemMapping(config)

	const regions = new Map<string, Region>()
	for (const region of deserialised.Regions)
		regions.set(region.RegionCoords().stringify(), region.ToRegionWithConfig(config))

	const players = new Map<string, Id>()
	for (const player in deserialised.Players)
		players.set(player, SerialisableEntities.MapEntity(deserialised.Players[player], entityMap))

	// TODO: Unloaded players
	// TODO: Loading regions

	return new GameState(
		readGlobals(deserialised.Globals),
		SerialisableEntities.ToEntityValuesWithMapping(entityValuesMapFrom(deserialised.EntityValues), entityMap, solidMap, itemMap),
		regions,
		players,
		// TODO: Unloaded players
		// TODO: Loading regions
	)
}

function entityValuesMapFrom(deserialisedEntityValues: any) {
	return mapFrom(deserialisedEntityValues, k => +k, v => groupedEntityValuesFrom(v))
}

function readGlobals(deserialised: any) {
	const globals = { ...deserialised }
	if (globals.WorldBounds)
		globals.WorldBounds = Object.assign(new Box(0, 0, 0, 0, 0, 0), globals.WorldBounds)
	return globals
}

function UnadjustedGameStateFrom(deserialised: SerialisableGameState) {
	const regions = new Map<string, Region>()
	for (const region of deserialised.Regions)
		regions.set(region.RegionCoords().stringify(), region.ToRegion())

	return new GameState(
		readGlobals(deserialised.Globals),
		SerialisableEntities.ToEntityValues(entityValuesMapFrom(deserialised.EntityValues)),
		regions,
		mapFrom(deserialised.Players, k => k, v => v),
		// TODO: Unloaded players
		// TODO: Loading regions
	)
}

function mapFrom<KOut, VIn, VOut>(deserialisedMap: { [key: string]: VIn }, keyMapping: (key: string) => KOut, valueMapping: (value: VIn) => VOut) {
	const map = new Map<KOut, VOut>()
	for (const key in deserialisedMap)
		map.set(keyMapping(key), valueMapping(deserialisedMap[key]))
	return map
}

function groupedEntityValuesFrom(serialised: any) {
	const values: GroupedEntityValues = { ...serialised }
	if (serialised.CircularSize)
		values.CircularSize = Object.assign(new CircularSize(0, 0), serialised.CircularSize)
	if (serialised.BlockArea)
		values.BlockArea = Object.assign(new BlockArea(), serialised.BlockArea)
	if (serialised.BlockPosition)
		values.BlockPosition = Object.assign(new Vector3(0, 0, 0), serialised.BlockPosition)
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
	if (serialised.ToolState)
		values.ToolState = ToolState.From(serialised.ToolState)
	if (serialised.Velocity)
		values.Velocity = Object.assign(new Vector3(0, 0, 0), serialised.Velocity)
	return values
}
