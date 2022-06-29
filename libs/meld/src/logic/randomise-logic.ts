import { GameLogic, Random, TerrainManager } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { MeldConfig } from "../config/meld-config"
import { Block } from "../state/block"
import { MeldAction, RandomiseAction } from "../state/meld-action"

export class RandomiseLogic implements GameLogic<MeldAction> {
	constructor(
		private config: MeldConfig,
		private terrain: TerrainManager<Block>,
		private random: Random,
	) { }

	update(actions: MeldAction[]) {
		for (const action of actions)
			if (action instanceof RandomiseAction)
				this.randomiseBlock(action.block)
	}

	private randomiseBlock(block: Vector3) {
		const types = [...this.config.blockTypeMap.types.values()]
		this.terrain.set(Block.newFull(this.random.get.in(types)), block.x, block.y, block.z)
	}
}
