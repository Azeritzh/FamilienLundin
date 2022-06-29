import { GameLogic, Id, ValueSetter } from "@lundin/age"
import { MeldConfig } from "../config/meld-config"
import { MeldEntities } from "../state/entity-values"
import { MeldAction, NextSelectedBlockAction } from "../state/meld-action"

export class SelectedBlockLogic implements GameLogic<MeldAction> {
	constructor(
		private config: MeldConfig,
		private entities: MeldEntities,
		private setSelectedBlock: ValueSetter<Id>,
	) { }

	update(actions: MeldAction[]) {
		for (const action of actions)
			if (action instanceof NextSelectedBlockAction)
				this.incrementSelectedBlock()
	}

	private incrementSelectedBlock() {
		const blockTypes = [...this.config.blockTypeMap.types.values()]
		for (const [entity, previous] of this.entities.with.selectedBlock) {
			const previousIndex = blockTypes.indexOf(previous)
			const nextIndex = previousIndex + 1 < blockTypes.length
				? previousIndex + 1
				: 0
			this.setSelectedBlock.for(entity, blockTypes[nextIndex])
		}
	}
}
