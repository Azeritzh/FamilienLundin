import { GameLogic, Id, ValueGetter, ValueSetter } from "@lundin/age"
import { GameUpdate, SelectToolAction } from "../state/game-update"
import { SelectableTools } from "../values/selectable-tools"

export class SelectedToolLogic implements GameLogic<GameUpdate> {
	constructor(
		private SelectableTools: ValueGetter<SelectableTools>,
		private SetSelectableTools: ValueSetter<SelectableTools>,
	) { }

	Update(actions: GameUpdate[]) {
		for (const action of actions)
			if (action instanceof SelectToolAction)
				this.UpdateSelectedItemFor(action.Entity, action.ToolIndex)
	}

	private UpdateSelectedItemFor(entity: Id, index: number) {
		const selectableTools = this.SelectableTools.Of(entity)
		if (!selectableTools)
			return
		this.SetSelectableTools.For(entity, selectableTools.SelectTool(index))
	}
}
