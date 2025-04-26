import { Id } from "@lundin/age"
import { Meld } from "../../meld"
import { GameUpdate } from "../../state/game-update"
import { DisplayState, InputMode } from "../state/display-state"
import { InputParser } from "./input-parser"
import { CameraInputHandler } from "./camera-input-handler"
import { ChatInputHandler } from "./chat-input-handler"

export class InputHandler {
	constructor(
		private Game: Meld,
		private State: DisplayState,
		private Inputs: InputParser,
		private CameraInputHandler: CameraInputHandler,
		private ChatInputHandler: ChatInputHandler,
		private ActionHandlers: ActionHandler[],
	) { }

	GetNewActions() {
		const player = this.Game.State.Players.get(this.State.PlayerName)
		if (!player)
			return []

		this.Inputs.Update(player)
		this.CameraInputHandler.Update()
		this.ChatInputHandler.Update()

		if (this.State.InputMode == InputMode.Chat)
			return []
		return this.ActionHandlers.map(x => x.Update(player)).filter(x => x !== null)
	}

}

export interface ActionHandler {
	Update(player: Id): GameUpdate | null
}
