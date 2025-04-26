import { Id } from "@lundin/age"
import { SelectToolAction } from "../../state/game-update"
import { DisplayState, InputMode } from "../state/display-state"
import { Input } from "./input"
import { ActionHandler } from "./input-handler"
import { InputParser } from "./input-parser"

export class SelectToolInputHandler implements ActionHandler {
	constructor(
		private State: DisplayState,
		private Inputs: InputParser,
	) { }

	Update(player: Id) {
		const Inputs = this.Inputs
		if (Inputs.HasJustBeenPressed(this.SelectTopToolInput()))
			return new SelectToolAction(player, 0)
		if (Inputs.HasJustBeenPressed(this.SelectRightToolInput()))
			return new SelectToolAction(player, 1)
		if (Inputs.HasJustBeenPressed(this.SelectBottomToolInput()))
			return new SelectToolAction(player, 2)
		if (Inputs.HasJustBeenPressed(this.SelectLeftToolInput()))
			return new SelectToolAction(player, 3)
		return null
	}

	private SelectTopToolInput() {
		return this.State.InputMode == InputMode.Selection
			? Input.SelectionModeSelectTopTool
			: Input.SelectTopTool
	}

	private SelectRightToolInput() {
		return this.State.InputMode == InputMode.Selection
			? Input.SelectionModeSelectRightTool
			: Input.SelectRightTool
	}

	private SelectBottomToolInput() {
		return this.State.InputMode == InputMode.Selection
			? Input.SelectionModeSelectBottomTool
			: Input.SelectBottomTool
	}

	private SelectLeftToolInput() {
		return this.State.InputMode == InputMode.Selection
			? Input.SelectionModeSelectLeftTool
			: Input.SelectLeftTool
	}
}
