import { Id } from "@lundin/age"
import { ActionState, UseToolAction } from "../../state/game-update"
import { DisplayState, InputMode } from "../state/display-state"
import { Input } from "./input"
import { ActionHandler } from "./input-handler"
import { InputParser } from "./input-parser"

export class ToolInputHandler implements ActionHandler {
	constructor(
		private State: DisplayState,
		private Inputs: InputParser,
	) { }

	Update(player: Id) {
		const Inputs = this.Inputs
		
		if (this.State.InputMode == InputMode.Chat)
			return null
		const target = Inputs.CurrentTarget
		const targetHasChanged = !Inputs.PreviousTarget.equals(target)
		const primaryState = this.ActionStateFor(this.ToolPrimaryInput())
		const secondaryState = this.ActionStateFor(this.ToolSecondaryInput())

		if (primaryState !== ActionState.Unchanged || secondaryState !== ActionState.Unchanged || this.ShouldUpdateToolTarget(targetHasChanged))
			return new UseToolAction(player, primaryState, secondaryState, target)
		return null
	}

	private ActionStateFor(input: Input) {
		if (this.Inputs.HasJustBeenPressed(input))
			return ActionState.Start
		if (this.Inputs.HasJustBeenReleased(input))
			return ActionState.End
		return ActionState.Unchanged
	}

	private ShouldUpdateToolTarget(targetHasChanged: boolean) {
		return targetHasChanged && (this.Inputs.BoolStateFor(this.ToolPrimaryInput()) || this.Inputs.BoolStateFor(this.ToolSecondaryInput()))
	}

	private ToolPrimaryInput() {
		return this.State.InputMode == InputMode.Normal
			? Input.NormalModeToolPrimary
			: Input.ToolPrimary
	}

	private ToolSecondaryInput() {
		return this.State.InputMode == InputMode.Normal
			? Input.NormalModeToolSecondary
			: Input.ToolSecondary
	}
}
