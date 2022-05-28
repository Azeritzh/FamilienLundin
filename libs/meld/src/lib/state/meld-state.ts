import { AgState, EntityCollection, Id, TerrainCollection, TypeMap } from "@lundin/age"
import { MeldConfig } from "../meld-config"
import { EntitySize } from "../values/entity-size"
import { Block, BlockType } from "./block"
import { BlockValues } from "./block-values"
import { EntityValues } from "./entity-values"

export class MeldState extends AgState<Block, BlockValues, EntityValues> {

	public static fromConfig(config: MeldConfig) {
		const typeMap = this.typeMapFor(config)
		return new MeldState(
			this.terrainCollectionFor(config, typeMap),
			this.entityCollectionFor(config, typeMap),
			this.typeMapFor(config),
		)
	}

	private static typeMapFor(config: MeldConfig) {
		// maybe the id generation should be split in two, so block ids aren't shifted, but type ids are?
		const typeNames = [...Object.keys(config.typeValues), ...Object.keys(config.blockValues)]
		return TypeMap.from(typeNames)
	}

	private static terrainCollectionFor(config: MeldConfig, typeMap: TypeMap) {
		return new TerrainCollection(
			new Block(BlockType.Empty, 0, 0),
			BlockValues.from(config.blockValues, typeMap),
			config.constants.chunkSize,
		)
	}

	private static entityCollectionFor(config: MeldConfig, typeMap: TypeMap) {
		return new EntityCollection(
			new EntityValues(),
			new EntityValues(),
			EntityValues.from(config.typeValues, typeMap),
		)
	}

	public size(entity: Id): EntitySize {
		return this.entities.entityValues.entitySizeValues.get(entity)
			?? this.entities.typeValues.entitySizeValues.get(this.typeOf(entity))
	}

	public sizeCurrently(entity: Id) {
		return this.entities.updatedEntityValues.entitySizeValues.get(entity)
			?? this.size(entity)
	}

	public positioning(entity: Id) {
		return this.entities.entityValues.positioningValues.get(entity)
			?? this.entities.typeValues.positioningValues.get(this.typeOf(entity))
	}

	public positioningCurrently(entity: Id) {
		return this.entities.updatedEntityValues.positioningValues.get(entity)
			?? this.positioning(entity)
	}

	public health(entity: Id) {
		return this.entities.entityValues.healthValues.get(entity)
			?? this.entities.typeValues.healthValues.get(this.typeOf(entity))
	}

	public healthCurrently(entity: Id) {
		return this.entities.updatedEntityValues.healthValues.get(entity)
			?? this.health(entity)
	}

	/*
			void AddNewEntity(SerialisedEntity newEntity) {
		var id = NextId++;
		var entity = TypeMapping.CreateEntity(newEntity.Type, id);
		// The next two calls would do well to be a single call to Entities, and should probably
		// also store the entity in a list for new entities like with the values
		Entities.Add(entity);
		Entities.UpdatedEntityValues.AddValuesFrom(entity.Id, newEntity.Values);
	}*/

	/*public EntityIdForPlayer(playerId: string): number {
		for(const entity of this.entities){
			if(entity instanceof PlayerEntity && entity.playerId === playerId)
				return entity.id
		}
		return null
	}*/
}
