import { Id, TypeMap } from "@lundin/age"
import { GameConfig } from "./game-config"

export class Version {
	constructor(
		public EntityTypeMap: TypeMap,
		public SolidTypeMap: TypeMap,
		public NonSolidTypeMap: TypeMap,
		public ItemTypeMap: TypeMap
	) { }

	SimilarTo(config: GameConfig) {
		if (this.EntityTypeMap.Count != config.EntityTypeMap.Count)
			return false
		if (this.SolidTypeMap.Count != config.SolidTypeMap.Count)
			return false
		if (this.NonSolidTypeMap.Count != config.NonSolidTypeMap.Count)
			return false
		if (this.ItemTypeMap.Count != config.ItemTypeMap.Count)
			return false
		for (const [key, value] of this.EntityTypeMap.Types)
			if (!config.EntityTypeMap.Types.has(key) || config.EntityTypeMap.Types.get(key) != value)
				return false
		for (const [key, value] of this.SolidTypeMap.Types)
			if (!config.SolidTypeMap.Types.has(key) || config.SolidTypeMap.Types.get(key) != value)
				return false
		for (const [key, value] of this.NonSolidTypeMap.Types)
			if (!config.NonSolidTypeMap.Types.has(key) || config.NonSolidTypeMap.Types.get(key) != value)
				return false
		for (const [key, value] of this.ItemTypeMap.Types)
			if (!config.ItemTypeMap.Types.has(key) || config.ItemTypeMap.Types.get(key) != value)
				return false
		return true
	}

	GetEntityMapping = (config: GameConfig) => CreateMapping(this.EntityTypeMap, config.EntityTypeMap)
	GetSolidMapping = (config: GameConfig) => CreateMapping(this.SolidTypeMap, config.SolidTypeMap)
	GetNonSolidMapping = (config: GameConfig) => CreateMapping(this.NonSolidTypeMap, config.NonSolidTypeMap)
	GetItemMapping = (config: GameConfig) => CreateMapping(this.ItemTypeMap, config.ItemTypeMap)
}

function CreateMapping(mapA: TypeMap, mapB: TypeMap) {
	const mapping = new Map<Id, Id>()
	for(const [key, value] of mapA.Types) {
		if (mapB.Types.has(key))
			mapping.set(value, mapB[key])
		else
			mapping.set(value, value) // unknown types are left as is
	}
	return mapping
}
