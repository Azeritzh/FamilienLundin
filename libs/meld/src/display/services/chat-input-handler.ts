import { DisplayProvider } from "@lundin/age"
import { Meld } from "../../meld"
import { DisplayConfig } from "../state/display-config"
import { DisplayState, InputMode } from "../state/display-state"
import { Input } from "./input"
import { InputParser } from "./input-parser"

export class ChatInputHandler {
	private PreviousArrowUp = 0

	constructor(
		private Game: Meld,
		private Config: DisplayConfig,
		private State: DisplayState,
		private DisplayProvider: DisplayProvider,
		private Inputs: InputParser,
	) { }

	Update() {
		const State = this.State
		if (this.Inputs.HasJustBeenPressed(Input.ToggleChat)) {
			if (State.InputMode === InputMode.Chat)
				this.StopChat()
			else
				this.StartChat()
		}

		if (State.InputMode !== InputMode.Chat)
			return

		const arrowUp = this.DisplayProvider.GetInputState("Up")
		if (this.PreviousArrowUp !== arrowUp && arrowUp === 1)
			State.ChatCurrentText = State.ChatLines[0] ?? ""
		this.PreviousArrowUp = arrowUp

		const input = this.DisplayProvider.GetTextInput()
		if (input.length === 0 || input === "\r")
			return
		else if (input === "\b" && State.ChatCurrentText.length > 0)
			State.ChatCurrentText = State.ChatCurrentText.substring(0, State.ChatCurrentText.length - 1)
		else
			State.ChatCurrentText += input
	}

	private StartChat() {
		this.DisplayProvider.StartTextInput()
		this.State.ChatCurrentText = ""
	}

	private StopChat() {
		this.DisplayProvider.StopTextInput()
		this.PostText()
	}

	private PostText() {
		const State = this.State
		if (State.ChatCurrentText.length === 0)
			return
		State.ChatLines.push(State.ChatCurrentText)
		try {
			const result = Function("Game", "Display", `"use strict"; return ${State.ChatCurrentText}`)(this.Game, { Config: this.Config })
			State.ChatLines.push(result)
		} catch {
			console.log("failed command")
		}
	}
}
