import { GameLogic } from "@lundin/age"
import { MinestrygerAction } from "../minestryger-action"
import { Field, MinestrygerState, PlayState } from "../minestryger-state"

export class WinLogic implements GameLogic<MinestrygerAction> {
	constructor(private state: MinestrygerState) { }

	Update() {
		if (this.state.playState !== PlayState.Started)
			return
		const allFields = [...this.state.board.allFields()].map(x => x.field)
		if (allFields.every(isRevealedXorBomb))
			this.finishGame()
	}

	private finishGame() {
		this.state.playState = PlayState.Won
		this.state.finishTime = Date.now() - (this.state.startTime ?? 0)
	}
}

function isRevealedXorBomb(field: Field) {
	if (field.revealed)
		return !field.bomb
	return field.bomb
}
