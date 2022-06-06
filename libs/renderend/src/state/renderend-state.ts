import { AgState, AgValues, EntityCollection, TerrainCollection, ValueAccessor } from "@lundin/age"
import { RenderendConfig } from "../renderend-config"
import { EntityValues } from "./entity-values"

export class RenderendState extends AgState<Block, BlockValues, EntityValues> {

	public static fromConfig(config: RenderendConfig) {
		return new RenderendState(
			this.terrainCollectionFor(config),
			this.entityCollectionFor(config),
		)
	}

	private static terrainCollectionFor(config: RenderendConfig) {
		return new TerrainCollection(
			new Block(),
			new BlockValues(),
			config.constants.chunkSize,
		)
	}

	private static entityCollectionFor(config: RenderendConfig) {
		return new EntityCollection(
			new EntityValues(),
			new EntityValues(),
			EntityValues.from(config.typeValues),
		)
	}

	public readonly size = ValueAccessor.For(this, x => x.entitySizeValues)
	public readonly positioning = ValueAccessor.For(this, x => x.positioningValues)
	public readonly health = ValueAccessor.For(this, x => x.healthValues)
}

export class Block {}
export class BlockValues extends AgValues {}
