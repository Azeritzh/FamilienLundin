import { PlayerEntity } from "../entities/player-entity"
import { MeldConfig } from "../meld-config"
import { EntityCollection } from "./entity-collection"
import { MeldAction } from "./meld-action"
import { TerrainCollection } from "./terrain-collection"

export class MeldState {
	constructor(
		public readonly terrain = new TerrainCollection(),
		public readonly entities = new EntityCollection(),
		public readonly typeMapping = new typeMapping(),
		public readonly actions: MeldAction[] = [], // ephemeral, only full during game update
		public seed = 1,
		public tick = 0,
		public nextId = 1,
		private randomGenerator?: Random,
	) { }

	public static FromConfig(config: MeldConfig) {
		const state = new MeldState()
		state.loadConfig(config)
		return state
	}

	public loadConfig(config: MeldConfig) {
		this.terrain.chunkSize = config.constants.chunkSize
		for (const type in config.typeValues)
			this.entities.typeValues.addValuesFrom(this.typeMapping.CreateEntityTypeId(type), config.typeValues[type])
		for (const type in config.classValues)
			this.entities.classValues.addValuesFrom(this.typeMapping.ClassFor(type), config.classValues[type])
		for (const type in config.solidBlockValues)
			this.terrain.solidBlockValues.addValuesFrom(this.typeMapping.CreateSolidBlockTypeId(type), config.solidBlockValues[type])
		for (const type in config.nonSolidBlockValues)
			this.terrain.nonSolidBlockValues.addValuesFrom(this.typeMapping.CreateNonSolidBlockTypeId(type), config.nonSolidBlockValues[type])
	}
	/*
		public LoadBaseState(baseState: BaseState) {
			Seed = baseState.Seed
			Tick = baseState.Tick
			for(const player of baseState.Players) {
				var typeId = TypeMapping.CreateEntityTypeId(player.Type); // Maybe we don't want to create missing ids here?
				Entities.Add(new PlayerEntity(typeId, player.EntityId, player.PlayerId));
				Entities.EntityValues.AddValuesFrom(player.EntityId, player.Values);
			}
		}
	
		public void LoadChunk(Chunk chunk) {
			//TODO: Not currently checking that type mapping is the same, but it should be
			var chunkCoords = chunk.ChunkCoords;
			var size = Terrain.ChunkSize;
			var offset = (chunkCoords.x * size.x, chunkCoords.y * size.y, chunkCoords.z * size.z);
			Terrain.Chunks[chunkCoords] = new BlockChunk(chunk.Blocks, offset);
			Entities.EntityValues.AddValuesFrom(chunk.EntityValues);
			foreach(var entity in chunk.Entities)
			Entities.Add(entity);
			foreach(var entity in chunk.NewEntities)
			AddNewEntity(entity);
		}
	
			void AddNewEntity(SerialisedEntity newEntity) {
		var id = NextId++;
		var entity = TypeMapping.CreateEntity(newEntity.Type, id);
		// The next two calls would do well to be a single call to Entities, and should probably
		// also store the entity in a list for new entities like with the values
		Entities.Add(entity);
		Entities.UpdatedEntityValues.AddValuesFrom(entity.Id, newEntity.Values);
	}*/

	public EntityIdForPlayer(playerId: string): number {
		for(const entity of this.entities){
			if(entity instanceof PlayerEntity && entity.playerId === playerId)
				return entity.id
		}
		return null
	}

	public random() {
		if (this.randomGenerator)
			return this.randomGenerator
		const newRandom = new Random(this.tick + this.seed)
		this.randomGenerator = newRandom
		return newRandom
	}

	public FinishUpdate() {
		this.entities.applyUpdatedValues()
		this.actions.splice(0, this.actions.length)
		this.randomGenerator = null
	}
}

class Random {
	constructor(private seed: number) { }
}
