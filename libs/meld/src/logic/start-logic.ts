import { GameLogic, Random, TerrainManager } from "@lundin/age"
import { MeldConfig } from "../meld-config"
import { Block } from "../state/block"
import { BlockValues } from "../state/block-values"
import { GenerateAction, MeldAction } from "../state/meld-action"

export class StartLogic implements GameLogic<MeldAction> {
	constructor(
		private config: MeldConfig,
		private terrain: TerrainManager<Block, BlockValues>,
		private random: Random,
	) { }

	update(actions: MeldAction[]) {
		if (actions.some(x => x instanceof GenerateAction))
			this.initialiseGame()
	}

	private initialiseGame() {
		this.terrain.addChunk([], 0, 0, 0)
		const types = [...this.config.typeMap.types.values()]
		for (const { x, y, z } of this.terrain.allFields())
			this.terrain.set(Block.newFull(this.random.get.in(types)), x, y, z)
	}
}