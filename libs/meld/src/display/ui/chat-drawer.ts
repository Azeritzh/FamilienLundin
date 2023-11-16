import { DisplayProvider } from "@lundin/age"
import { DisplayConfig } from "../state/display-config"
import { DisplayState, InputMode } from "../state/display-state"

export class ChatDrawer {
	constructor(
		private Config: DisplayConfig,
		private State: DisplayState,
		private DisplayProvider: DisplayProvider,
	) { }

	Draw() {
		const State = this.State
		if (State.InputMode != InputMode.Chat)
			return

		this.DisplayProvider.DrawString(State.ChatCurrentText, 6, 0.5, "default", 0.5, "black", false)
		for (let i = 0; i < State.ChatLines.length; i++)
			this.DisplayProvider.DrawString(State.ChatLines[State.ChatLines.length - i - 1], 6, 1 + 0.5 * i, "default", 0.5, "black", false)
	}
}
