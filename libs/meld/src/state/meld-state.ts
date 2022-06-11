import { BaseState, TerrainCollection } from "@lundin/age"
import { MeldConfig } from "../meld-config"
import { Block, BlockType } from "./block"
import { BlockValues } from "./block-values"
import { EntityValues } from "./entity-values"

export class MeldState extends BaseState<Block, BlockValues, EntityValues> {

	public static fromConfig(config: MeldConfig) {
		return new MeldState(
			this.terrainCollectionFor(config),
			new EntityValues(),
		)
	}

	private static terrainCollectionFor(config: MeldConfig) {
		return new TerrainCollection(
			new Block(BlockType.Empty, 0, 0),
			new BlockValues(),
			config.constants.chunkSize,
		)
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
