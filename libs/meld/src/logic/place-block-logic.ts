import { GameLogic, Id, TerrainManager, ValueGetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Block, Blocks, BlockType } from "../state/block"
import { GameUpdate, PlaceBlockAction } from "../state/game-update"

export class PlaceBlockLogic implements GameLogic<GameUpdate> {
	constructor(
		private Terrain: TerrainManager<Block>,
		private SelectedItem: ValueGetter<Id>
	) { }

	update(actions: GameUpdate[]) {
		for (const action of actions)
			if (action instanceof PlaceBlockAction)
				this.placeBlock(action.Entity, action.Position)
	}

	private placeBlock(entity: Id, position: Vector3) {
		const block = this.SelectedItem.Of(entity)
		if (!(block > -1))
			return
		const currentBlock = this.Terrain.GetAt(position) ?? Blocks.NewEmpty(0)
		if (Blocks.SolidOf(currentBlock) != block)
			this.Terrain.SetAt(position, Blocks.NewFloor(block, 0))
		else if (Blocks.TypeOf(currentBlock) == BlockType.Empty)
			this.Terrain.SetAt(position, Blocks.NewFloor(block, 0))
		else if (Blocks.TypeOf(currentBlock) == BlockType.Floor)
			this.Terrain.SetAt(position, Blocks.NewHalf(block, 0))
		else if (Blocks.TypeOf(currentBlock) == BlockType.Half)
			this.Terrain.SetAt(position, Blocks.NewFull(block))
		else if (Blocks.TypeOf(currentBlock) == BlockType.Full)
			this.Terrain.SetAt(position, Blocks.NewFloor(block, 0))
	}
}
