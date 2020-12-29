import { GameLogic } from "@lundin/age"
import { MinestrygerAction } from "../minestryger-action"
import { Field, MinestrygerState, PlayState } from "../minestryger-state"

export class WinLogic implements GameLogic<MinestrygerAction> {
	constructor(private state: MinestrygerState) { }

	update() {
		if (this.state.playState !== PlayState.Started)
			return
		const allFields = [...this.state.board.allFields()].map(x => x.field)
		if (allFields.every(isRevealedXorBomb))
			this.state.playState = PlayState.Won
	}
}

function isRevealedXorBomb(field: Field) {
	if (field.revealed)
		return !field.bomb
	return field.bomb
}
