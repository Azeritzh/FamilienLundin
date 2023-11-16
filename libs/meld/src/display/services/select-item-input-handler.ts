import { Id } from "@lundin/age"
import { Meld } from "../../meld"
import { SelectItemAction, SelectItemSetAction } from "../../state/game-update"
import { DisplayState, InputMode } from "../state/display-state"
import { Input } from "./input"
import { ActionHandler } from "./input-handler"
import { InputParser } from "./input-parser"

export class SelectItemInputHandler implements ActionHandler {
	constructor(
		private Game: Meld,
		private State: DisplayState,
		private Inputs: InputParser,
	) { }

	Update(player: Id) {
		const selectableItems = this.Game.Entities.SelectableItems.Get.Of(player)
		if (!selectableItems)
			return null

		const State = this.State
		const Inputs = this.Inputs
		const currentItem = selectableItems.CurrentItemInSet
		if (Inputs.HasJustBeenPressed(Input.SelectNextItem))
			return new SelectItemAction(player, currentItem + 1)
		if (Inputs.HasJustBeenPressed(Input.SelectPreviousItem))
			return new SelectItemAction(player, currentItem - 1)

		if (Inputs.HasJustBeenPressed(this.SelectTopItemInput()))
			return State.InputMode == InputMode.Selection && currentItem === 0
				? new SelectItemSetAction(player, 0)
				: new SelectItemAction(player, 0)
		if (Inputs.HasJustBeenPressed(this.SelectRightItemInput()))
			return State.InputMode == InputMode.Selection && currentItem === 1
				? new SelectItemSetAction(player, 1)
				: new SelectItemAction(player, 1)
		if (Inputs.HasJustBeenPressed(this.SelectBottomItemInput()))
			return State.InputMode == InputMode.Selection && currentItem === 2
				? new SelectItemSetAction(player, 2)
				: new SelectItemAction(player, 2)
		if (Inputs.HasJustBeenPressed(this.SelectLeftItemInput()))
			return State.InputMode == InputMode.Selection && currentItem === 3
				? new SelectItemSetAction(player, 3)
				: new SelectItemAction(player, 3)
	}

	private SelectTopItemInput() {
		return this.State.InputMode == InputMode.Selection
			? Input.SelectionModeSelectTopItem
			: Input.SelectTopItem
	}

	private SelectRightItemInput() {
		return this.State.InputMode == InputMode.Selection
			? Input.SelectionModeSelectRightItem
			: Input.SelectRightItem
	}

	private SelectBottomItemInput() {
		return this.State.InputMode == InputMode.Selection
			? Input.SelectionModeSelectBottomItem
			: Input.SelectBottomItem
	}

	private SelectLeftItemInput() {
		return this.State.InputMode == InputMode.Selection
			? Input.SelectionModeSelectLeftItem
			: Input.SelectLeftItem
	}
}
