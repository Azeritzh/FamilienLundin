import { Id } from "@lundin/age"
import { ActionState, UseItemAction } from "../../state/game-update"
import { DisplayState, InputMode } from "../state/display-state"
import { Input } from "./input"
import { ActionHandler } from "./input-handler"
import { InputParser } from "./input-parser"

export class ItemInputHandler implements ActionHandler {
	constructor(
		private State: DisplayState,
		private Inputs: InputParser,
	) { }

	Update(player: Id) {
		const target = this.Inputs.CurrentTarget
		const targetHasChanged = !this.Inputs.PreviousTarget.equals(target)
		if (this.Inputs.HasJustBeenPressed(this.UseItemInput()))
			return new UseItemAction(player, ActionState.Start, target)
		if (this.Inputs.HasJustBeenReleased(this.UseItemInput()))
			return new UseItemAction(player, ActionState.End, target)
		if (this.Inputs.BoolStateFor(this.UseItemInput()) && targetHasChanged)
			return new UseItemAction(player, ActionState.Unchanged, target)
		return null
	}

	private UseItemInput() {
		return this.State.InputMode == InputMode.Normal
			? Input.NormalModeUseItem
			: Input.UseItem
	}
}
