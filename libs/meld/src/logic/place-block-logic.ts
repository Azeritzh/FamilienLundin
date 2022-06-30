import { GameLogic, Random, TerrainManager } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { GameConfig } from "../config/game-config"
import { Block } from "../state/block"
import { MeldEntities } from "../state/entity-values"
import { MeldAction, PlaceBlockAction } from "../state/meld-action"

export class PlaceBlockLogic implements GameLogic<MeldAction> {
	constructor(
		private config: GameConfig,
		private entities: MeldEntities,
		private terrain: TerrainManager<Block>,
		private random: Random,
	) { }

	update(actions: MeldAction[]) {
		for (const action of actions)
			if (action instanceof PlaceBlockAction)
				this.placeBlock(action.block)
	}

	private placeBlock(block: Vector3) {
		const types = [...this.config.solidTypeMap.types.values()]
		const selectedBlocks = [...this.entities.with.selectedBlock.values()]
		const blockType = selectedBlocks[0] ?? this.random.get.in(types)
		this.terrain.set(Block.newFloor(blockType, 0), block.x, block.y, block.z)
	}
}
