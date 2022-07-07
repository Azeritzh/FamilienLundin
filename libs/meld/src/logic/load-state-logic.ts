import { GameLogic } from "@lundin/age"
import { GameState } from "../state/game-state"
import { GameUpdate, LoadState } from "../state/game-update"

export class LoadStateLogic implements GameLogic<GameUpdate> {
	constructor(
		private state: GameState,
	) { }

	update(updates: GameUpdate[]) {
		const update = updates.find(x => x instanceof LoadState) as LoadState
		if (update)
			this.state.loadFrom(update.state)
	}
}