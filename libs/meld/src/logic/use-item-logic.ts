import { GameLogic, Id, TerrainManager, ValueGetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { GameConfig } from "../config/game-config"
import { Block, Blocks, BlockType } from "../state/block"
import { GameUpdate, UseItemAction, UseItemActionType } from "../state/game-update"
import { Item, ItemKind } from "../state/item"
import { SelectableItems } from "../values/selectable-items"

export class UseItemLogic implements GameLogic<GameUpdate> {
	constructor(
		private Config: GameConfig,
		private Terrain: TerrainManager<Block>,
		private SelectableItems: ValueGetter<SelectableItems>
	) { }

	update(actions: GameUpdate[]) {
		for (const action of actions)
			if (action instanceof UseItemAction)
				this.UseItem(action.Entity, action.ActionType, action.Target)
	}

	private UseItem(entity: Id, actionType: UseItemActionType, position: Vector3) {
		const selectableItems = this.SelectableItems.Of(entity)
		const item = selectableItems?.CurrentItem()
		if (!item)
			return
		if (this.Config.ItemValues.get(item.Type)?.Kind == ItemKind.Solid)
			this.PlaceBlock(item, actionType, position)
	}

	private PlaceBlock(item: Item, actionType: UseItemActionType, position: Vector3) {
		if (actionType != UseItemActionType.Start)
			return

		const block = item.Content
		const currentBlock = this.Terrain.GetAt(position) ?? Blocks.NewEmpty(0)
		if (Blocks.TypeOf(currentBlock) == BlockType.Empty)
			this.Terrain.SetAt(position, Blocks.NewFloor(block, Blocks.NonSolidOf(currentBlock)))
		else if (Blocks.SolidOf(currentBlock) != block)
			this.Terrain.SetAt(position, Blocks.New(Blocks.TypeOf(currentBlock), block, Blocks.NonSolidOf(currentBlock)))
		else if (Blocks.TypeOf(currentBlock) == BlockType.Floor)
			this.Terrain.SetAt(position, Blocks.NewHalf(block,  Blocks.NonSolidOf(currentBlock)))
		else if (Blocks.TypeOf(currentBlock) == BlockType.Half)
			this.Terrain.SetAt(position, Blocks.NewFull(block))
	}
}
