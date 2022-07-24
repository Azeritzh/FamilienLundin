import { GameLogic, Id, ValueGetter, ValueSetter } from "@lundin/age"
import { GameUpdate, SelectNextItemAction } from "../state/game-update"
import { SelectableItems } from "../values/selectable-items"

export class SelectedItemLogic implements GameLogic<GameUpdate> {
	constructor(
		private SelectableItems: ValueGetter<SelectableItems>,
		private SetSelectableItems: ValueSetter<SelectableItems>,
	) { }

	update(actions: GameUpdate[]) {
		for (const action of actions)
			if (action instanceof SelectNextItemAction)
				this.incrementSelectedItemFor(action.Entity)
	}

	private incrementSelectedItemFor(entity: Id) {
		const selectableItems = this.SelectableItems.Of(entity)
		if (!selectableItems)
			return
		this.SetSelectableItems.For(entity, selectableItems.SelectItem(1))
	}
}
