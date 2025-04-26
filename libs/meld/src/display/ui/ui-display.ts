import { Id } from "@lundin/age"
import { Meld } from "../../meld"
import { DisplayState } from "../state/display-state"

export class UiDisplay {
	static BottomLayer = 0.9998
	static TopLayer = 0.9999

	constructor(
		private Game: Meld,
		private State: DisplayState,
		private UiDrawers: UiDrawer[],
	) { }

	Draw() {
		const playerId = this.Game.State.Players.get(this.State.PlayerName)
		if (playerId === undefined)
			return
		for (const drawer of this.UiDrawers)
			drawer.Draw(playerId)
	}
}

export interface UiDrawer {
	Draw(player: Id): void
}
