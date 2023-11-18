import { Box, Id, TypeMap } from "@lundin/age"
import { EntityValues, GroupedEntityValues, GroupedEntityValuesFrom, SerialisableEntities } from "./entity-values"
import { Globals } from "./globals"
import { Region, SerialisableBlockChunk, SerialisableRegion } from "./region"
import { GameConfig } from "../config/game-config"
import { Version } from "../config/version"
import { Vector3 } from "@lundin/utility"

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

	static From(config: GameConfig, deserialised: SerialisableGameState) {
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
			return GameState.UnadjustedFrom(deserialised)

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

	static UnadjustedFrom(deserialised: SerialisableGameState) {
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
}

function entityValuesMapFrom(deserialisedEntityValues: any) {
	return mapFrom(deserialisedEntityValues, k => +k, v => GroupedEntityValuesFrom(v))
}

function readGlobals(deserialised: any) {
	const globals = { ...deserialised }
	if (globals.WorldBounds)
		globals.WorldBounds = Object.assign(new Box(0, 0, 0, 0, 0, 0), globals.WorldBounds)
	return globals
}

function mapFrom<KOut, VIn, VOut>(deserialisedMap: { [key: string]: VIn }, keyMapping: (key: string) => KOut, valueMapping: (value: VIn) => VOut) {
	const map = new Map<KOut, VOut>()
	for (const key in deserialisedMap)
		map.set(keyMapping(key), valueMapping(deserialisedMap[key]))
	return map
}

export class SerialisableGameState {
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
			state.EntityValues[key] = GroupedEntityValuesFrom(state.EntityValues[key])
		for (const index in state.Regions)
			state.Regions[index] = SerialisableRegion.fromDeserialised(state.Regions[index])
		return state
	}

	static From(state: GameState, config: GameConfig = null): SerialisableGameState {
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
}
