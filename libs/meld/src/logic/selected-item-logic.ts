import { GameLogic, Id, ValueGetter, ValueSetter } from "@lundin/age"
import { GameConfig } from "../config/game-config"
import { MeldAction, SelectNextItemAction } from "../state/meld-action"

export class SelectedItemLogic implements GameLogic<MeldAction> {
	constructor(
		private config: GameConfig,
		private selectedBlock: ValueGetter<Id>,
		private setSelectedBlock: ValueSetter<Id>,
	) { }

	update(actions: MeldAction[]) {
		for (const action of actions)
			if (action instanceof SelectNextItemAction)
				this.incrementSelectedItemFor(action.entity)
	}

	private incrementSelectedItemFor(entity: Id) {
		const blockTypes = [...this.config.solidTypeMap.types.values()]
		const previous = this.selectedBlock.of(entity)
		const previousIndex = blockTypes.indexOf(previous)
		const nextIndex = previousIndex + 1 < blockTypes.length
			? previousIndex + 1
			: 0
		this.setSelectedBlock.for(entity, blockTypes[nextIndex])
	}
}
