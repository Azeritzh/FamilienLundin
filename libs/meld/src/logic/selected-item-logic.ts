import { GameLogic, Id, ValueGetter, ValueSetter } from "@lundin/age"
import { GameConfig } from "../config/game-config"
import { GameUpdate, SelectNextItemAction } from "../state/game-update"

export class SelectedItemLogic implements GameLogic<GameUpdate> {
	constructor(
		private Config: GameConfig,
		private SelectedBlock: ValueGetter<Id>,
		private SetSelectedBlock: ValueSetter<Id>,
	) { }

	update(actions: GameUpdate[]) {
		for (const action of actions)
			if (action instanceof SelectNextItemAction)
				this.incrementSelectedItemFor(action.Entity)
	}

	private incrementSelectedItemFor(entity: Id) {
		const blockTypes = [...this.Config.SolidTypeMap.Types.values()]
		const previous = this.SelectedBlock.Of(entity)
		const previousIndex = blockTypes.indexOf(previous)
		const nextIndex = previousIndex + 1 < blockTypes.length
			? previousIndex + 1
			: 0
		this.SetSelectedBlock.For(entity, blockTypes[nextIndex])
	}
}
