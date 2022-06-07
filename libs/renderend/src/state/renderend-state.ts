import { BaseState, AgValues, TerrainCollection } from "@lundin/age"
import { RenderendConfig } from "../renderend-config"
import { EntityValues } from "./entity-values"

export class RenderendState extends BaseState<Block, BlockValues, EntityValues> {

	public static fromConfig(config: RenderendConfig) {
		return new RenderendState(
			this.terrainCollectionFor(config),
			new EntityValues(),
		)
	}

	private static terrainCollectionFor(config: RenderendConfig) {
		return new TerrainCollection(
			new Block(),
			new BlockValues(),
			config.constants.chunkSize,
		)
	}
}

export class Block {}
export class BlockValues extends AgValues {}
