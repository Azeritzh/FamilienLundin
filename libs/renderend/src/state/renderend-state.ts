import { AgState, AgValues, EntityCollection, TerrainCollection, TypeMap, ValueAccessor } from "@lundin/age"
import { RenderendConfig } from "../renderend-config"
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

	public size = new ValueAccessor(
		this.entities.entityValues.entitySizeValues,
		this.entities.updatedEntityValues.entitySizeValues,
		this.entities.typeValues.entitySizeValues,
	)

	public positioning = new ValueAccessor(
		this.entities.entityValues.positioningValues,
		this.entities.updatedEntityValues.positioningValues,
		this.entities.typeValues.positioningValues,
	)

	public health = new ValueAccessor(
		this.entities.entityValues.healthValues,
		this.entities.updatedEntityValues.healthValues,
		this.entities.typeValues.healthValues,
	)
}

export class Block {}
export class BlockValues extends AgValues {}
