import { GameLogic } from "@lundin/age"
import { FlagAction, MinestrygerAction } from "../minestryger-action"
import { MinestrygerConfig } from "../minestryger-config"
import { MinestrygerState } from "../minestryger-state"

export class FlagLogic implements GameLogic<MinestrygerAction> {
	constructor(
		private config: MinestrygerConfig,
		private state: MinestrygerState,
	) { }

	update(actions: MinestrygerAction[]) {
		if (!this.config.allowFlags)
			return
		for (const action of actions)
			if (action instanceof FlagAction)
				this.flag(action.x, action.y)
	}

	private flag(x: number, y: number) {
		this.state.hasUsedFlags = true
		const field = this.state.board.get(x, y)
		if (field.revealed)
			return
		field.locked = !field.locked
	}
}
