import { GameLogic } from "@lundin/age"
import { MinestrygerAction, RevealAction, RevealAreaAction } from "../minestryger-action"
import { MinestrygerState, PlayState } from "../minestryger-state"

export class RevealLogic implements GameLogic<MinestrygerAction> {
	constructor(private state: MinestrygerState) { }

	Update(actions: MinestrygerAction[]) {
		if (this.state.playState !== PlayState.Started)
			return
		for (const action of actions)
			this.handleAction(action)
	}

	private handleAction(action: MinestrygerAction) {
		if (action instanceof RevealAction)
			this.reveal(action.x, action.y)
		else if (action instanceof RevealAreaAction)
			this.revealArea(action.x, action.y)
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

	private revealArea(x: number, y: number) {
		const field = this.state.board.get(x, y)
		if (!field.revealed)
			return
		const lockedFields = [...this.state.board.fieldsAround(x, y)]
			.filter(x => x.field.locked)
			.length
		if (lockedFields === field.surroundingBombs)
			this.revealNearby(x, y)
	}
}
