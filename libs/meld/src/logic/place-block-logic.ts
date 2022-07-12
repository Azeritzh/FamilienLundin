import { GameLogic, Id, TerrainManager, ValueGetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Block, Blocks, BlockType } from "../state/block"
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
		const currentBlock = this.terrain.getAt(position) ?? Blocks.NewEmpty(0)
		if (Blocks.SolidOf(currentBlock) != block)
			this.terrain.setAt(position, Blocks.NewFloor(block, 0))
		else if (Blocks.TypeOf(currentBlock) == BlockType.Empty)
			this.terrain.setAt(position, Blocks.NewFloor(block, 0))
		else if (Blocks.TypeOf(currentBlock) == BlockType.Floor)
			this.terrain.setAt(position, Blocks.NewHalf(block, 0))
		else if (Blocks.TypeOf(currentBlock) == BlockType.Half)
			this.terrain.setAt(position, Blocks.NewFull(block))
		else if (Blocks.TypeOf(currentBlock) == BlockType.Full)
			this.terrain.setAt(position, Blocks.NewFloor(block, 0))
	}
}
