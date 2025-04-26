import { GameLogic } from "@lundin/age"
import { MinestrygerAction, RevealAction, RevealAreaAction } from "../minestryger-action"
import { MinestrygerState, PlayState } from "../minestryger-state"

export class LoseLogic implements GameLogic<MinestrygerAction> {
	constructor(private state: MinestrygerState) { }

	Update(actions: MinestrygerAction[]) {
		if (this.state.playState !== PlayState.Started)
			return
		for (const action of actions)
			this.handleAction(action)
	}

	private handleAction(action: MinestrygerAction) {
		if (action instanceof RevealAction)
			this.check(action.x, action.y)
		else if (action instanceof RevealAreaAction) {
			this.check(action.x, action.y)
			for (const { i, j } of this.state.board.fieldsAround(action.x, action.y))
				this.check(i, j)
		}
	}

	private check(x: number, y: number) {
		if (!this.isRevealedBomb(x, y))
			return
		this.state.playState = PlayState.Lost
		this.state.finishTime = Date.now() - (this.state.startTime ?? 0)
		for (const { field } of this.state.board.allFields())
			if (field.bomb)
				field.revealed = true
	}

	private isRevealedBomb(x: number, y: number) {
		const field = this.state.board.get(x, y)
		return field.revealed && field.bomb
	}
}