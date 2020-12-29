import { GameLogic } from "@lundin/age"
import { MinestrygerAction, RevealAction } from "../minestryger-action"
import { MinestrygerState } from "../minestryger-state"

export class RevealLogic implements GameLogic<MinestrygerAction> {
	constructor(private state: MinestrygerState) { }

	update(actions: MinestrygerAction[]) {
		for (const action of actions)
			if (action instanceof RevealAction)
				this.reveal(action.x, action.y)
	}

	private reveal(x: number, y: number) {
		const field = this.state.board.get(x, y)
		if (field.revealed || field.locked)
			return
		field.revealed = true
		if (field.surroundingBombs === 0)
			this.revealNearby(x, y)
	}

	private revealNearby(x: number, y: number) {
		for (const { i, j } of this.state.board.fieldsAround(x, y))
			this.reveal(i, j)
	}
}