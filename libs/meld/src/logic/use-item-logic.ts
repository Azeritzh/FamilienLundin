import { GameLogic, Id, ValueGetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { GameConfig } from "../config/game-config"
import { ChangeBlockService } from "../services/change-block-service"
import { ActionState, GameUpdate, UseItemAction } from "../state/game-update"
import { Item, ItemKind } from "../state/item"
import { SelectableItems } from "../values/selectable-items"

export class UseItemLogic implements GameLogic<GameUpdate> {
	constructor(
		private Config: GameConfig,
		private ChangeBlockService: ChangeBlockService,
		private SelectableItems: ValueGetter<SelectableItems>
	) { }

	Update(actions: GameUpdate[]) {
		for (const action of actions)
			if (action instanceof UseItemAction)
				this.UseItem(action.Entity, action.ActionState, action.Target)
	}

	private UseItem(entity: Id, actionType: ActionState, position: Vector3) {
		const selectableItems = this.SelectableItems.Of(entity)
		const item = selectableItems?.CurrentItem()
		if (!item)
			return
		if (this.Config.ItemValues.get(item.Type)?.Kind === ItemKind.Solid)
			this.PlaceBlock(item, actionType, position)
	}

	private PlaceBlock(item: Item, actionType: ActionState, position: Vector3) {
		if (actionType != ActionState.Start)
			return
		this.ChangeBlockService.PlaceBlock(position, item.Content)
	}
}
