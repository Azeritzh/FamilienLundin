import { BaseState, BaseValues, TerrainCollection } from "@lundin/age"
import { RenderendConfig } from "../renderend-config"
import { EntityValues } from "./entity-values"
import { Globals } from "./globals"

export class RenderendState extends BaseState<Globals, Block, BlockValues, EntityValues> {

	public static fromConfig(config: RenderendConfig) {
		return new RenderendState(
			new Globals(),
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
export class BlockValues extends BaseValues {}
