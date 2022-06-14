import { GameLogic, TerrainManager } from "@lundin/age"
import { MeldConfig } from "../meld-config"
import { Block } from "../state/block"
import { BlockValues } from "../state/block-values"
import { GenerateAction, MeldAction } from "../state/meld-action"

export class StartLogic implements GameLogic<MeldAction> {
	constructor(
		private config: MeldConfig,
		private terrain: TerrainManager<Block, BlockValues>,
	) { }

	update(actions: MeldAction[]) {
		if (actions.some(x => x instanceof GenerateAction))
			this.initialiseGame()
	}

	private initialiseGame() {
		this.terrain.addChunk([], 0, 0, 0)
		for (const { x, y, z } of this.terrain.allFields())
			this.terrain.set(Block.newFull(0), x, y, z)
	}
}