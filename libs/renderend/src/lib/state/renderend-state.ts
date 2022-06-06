import { AgState, AgValues, EntityCollection, Id, TerrainCollection, TypeMap } from "@lundin/age"
import { RenderendConfig } from "../renderend-config"
import { EntitySize } from "../values/entity-size"
import { Positioning } from "../values/positioning"
import { EntityValues } from "./entity-values"

export class RenderendState extends AgState<Block, BlockValues, EntityValues> {

	public static fromConfig(config: RenderendConfig) {
		const typeMap = this.typeMapFor(config)
		return new RenderendState(
			this.terrainCollectionFor(config),
			this.entityCollectionFor(config, typeMap),
			this.typeMapFor(config),
		)
	}

	private static typeMapFor(config: RenderendConfig) {
		return TypeMap.from(Object.keys(config.typeValues))
	}

	private static terrainCollectionFor(config: RenderendConfig) {
		return new TerrainCollection(
			new Block(),
			new BlockValues(),
			config.constants.chunkSize,
		)
	}

	private static entityCollectionFor(config: RenderendConfig, typeMap: TypeMap) {
		return new EntityCollection(
			new EntityValues(),
			new EntityValues(),
			EntityValues.from(config.typeValues, typeMap),
		)
	}

	public size(entity: Id) {
		return this.entities.entityValues.entitySizeValues.get(entity)
			?? this.entities.typeValues.entitySizeValues.get(this.typeOf(entity))
	}

	public sizeCurrently(entity: Id) {
		return this.entities.updatedEntityValues.entitySizeValues.get(entity)
			?? this.size(entity)
	}

	public setSize(entity: Id, size: EntitySize) {
		this.entities.updatedEntityValues.entitySizeValues.set(entity, size)
	}

	public positioning(entity: Id) {
		return this.entities.entityValues.positioningValues.get(entity)
			?? this.entities.typeValues.positioningValues.get(this.typeOf(entity))
	}

	public positioningCurrently(entity: Id) {
		return this.entities.updatedEntityValues.positioningValues.get(entity)
			?? this.positioning(entity)
	}

	public setPositioning(entity: Id, positioning: Positioning) {
		this.entities.updatedEntityValues.positioningValues.set(entity, positioning)
	}

	public health(entity: Id) {
		return this.entities.entityValues.healthValues.get(entity)
			?? this.entities.typeValues.healthValues.get(this.typeOf(entity))
	}

	public healthCurrently(entity: Id) {
		return this.entities.updatedEntityValues.healthValues.get(entity)
			?? this.health(entity)
	}

	public setHealth(entity: Id, health: number) {
		this.entities.updatedEntityValues.healthValues.set(entity, health)
	}
}

export class Block {}
export class BlockValues extends AgValues {}
