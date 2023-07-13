import { GameLogic, Id, ValueGetter, ValueSetter } from "@lundin/age"
import { GameUpdate, SelectItemAction, SelectItemSetAction } from "../state/game-update"
import { SelectableItems } from "../values/selectable-items"

export class SelectedItemLogic implements GameLogic<GameUpdate> {
	constructor(
		private SelectableItems: ValueGetter<SelectableItems>,
		private SetSelectableItems: ValueSetter<SelectableItems>,
	) { }

	Update(actions: GameUpdate[]) {
		for (const action of actions)
			if (action instanceof SelectItemAction)
				this.UpdateSelectedItemFor(action.Entity, action.ItemIndex)
			else if (action instanceof SelectItemSetAction)
				this.UpdateSelectedItemSetFor(action.Entity, action.ItemSetIndex)
	}

	private UpdateSelectedItemFor(entity: Id, index: number) {
		const selectableItems = this.SelectableItems.Of(entity)
		if (!selectableItems)
			return
		this.SetSelectableItems.For(entity, selectableItems.SelectItem(index))
	}

	private UpdateSelectedItemSetFor(entity: Id, index: number) {
		const selectableItems = this.SelectableItems.Of(entity)
		if (!selectableItems)
			return
		this.SetSelectableItems.For(entity, selectableItems.SelectItemSet(index))
	}
}
