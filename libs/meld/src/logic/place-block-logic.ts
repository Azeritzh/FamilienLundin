import { GameLogic, Id, TerrainManager, ValueGetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Block, BlockType } from "../state/block"
import { GameUpdate, PlaceBlockAction } from "../state/game-update"

export class PlaceBlockLogic implements GameLogic<GameUpdate> {
	constructor(
		private terrain: TerrainManager<Block>,
		private selectedItem: ValueGetter<Id>
	) { }

	update(actions: GameUpdate[]) {
		for (const action of actions)
			if (action instanceof PlaceBlockAction)
				this.placeBlock(action.entity, action.position)
	}

	private placeBlock(entity: Id, position: Vector3) {
		const block = this.selectedItem.of(entity)
		if (!(block > -1))
			return
		const currentBlock = this.terrain.getAt(position) ?? Block.newEmpty(0)
		if (currentBlock.solidType != block)
			this.terrain.setAt(position, Block.newFloor(block, 0))
		else if (currentBlock.blockType == BlockType.Empty)
			this.terrain.setAt(position, Block.newFloor(block, 0))
		else if (currentBlock.blockType == BlockType.Floor)
			this.terrain.setAt(position, Block.newHalf(block, 0))
		else if (currentBlock.blockType == BlockType.Half)
			this.terrain.setAt(position, Block.newFull(block))
		else if (currentBlock.blockType == BlockType.Full)
			this.terrain.setAt(position, Block.newFloor(block, 0))
	}
}
