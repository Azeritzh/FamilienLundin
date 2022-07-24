import { BaseInputParser, DisplayProvider, Id } from "@lundin/age"
import { Vector2, Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { GenerateAction, MovementAction, SelectItemAction, UseItemAction, ChargeDashAction, ReleaseDashAction, UseItemActionType } from "../../state/game-update"
import { Camera } from "./camera"
import { AngleOf, DisplayState, InputMode } from "../state/display-state"
import { Visibility } from "./visibility"
import { Input } from "./input"

export class InputParser extends BaseInputParser<Input> {

	constructor(
		private Game: Meld,
		private State: DisplayState,
		private Camera: Camera,
		private Visibility: Visibility,
		private DisplayProvider: DisplayProvider,
		Inputs: Map<Input, string[]>,
	) {
		super(DisplayProvider, Inputs)
	}

	ParseInputs() {
		this.UpdateMode()
		this.UpdateCamera()
		this.updateActionStates()
		const player = this.Game.State.Players.get(this.State.PlayerName)
		return [
			this.ParseGenerate(),
			this.ParseDash(player),
			this.ParseMovement(player),
			this.ParseUseItem(player),
			this.ParseSelectItem(player),
		].filter(x => x)
	}

	private UpdateMode() {
		if (this.boolStateFor(Input.HoldCamera))
			this.State.InputMode = InputMode.Camera
		else if (this.boolStateFor(Input.HoldSelection))
			this.State.InputMode = InputMode.Selection
		else
			this.State.InputMode = InputMode.Normal
	}

	private ParseGenerate() {
		if (this.hasJustBeenPressed(Input.Generate))
			return new GenerateAction()
	}

	private GetVectorToMouse(player: Id) {
		const pointerVector = this.Camera.TilePositionFor(
			this.DisplayProvider.getInputState("MouseX"),
			this.DisplayProvider.getInputState("MouseY")
		).subtract(this.Game.Entities.Position.Get.Of(player) ?? new Vector3(0, 0, 0))
		return new Vector2(pointerVector.x, pointerVector.y)
	}

	//////////////////////////////// CAMERA ////////////////////////////////

	private UpdateCamera() {
		if (this.hasJustBeenPressed(this.RotateRightInput())) {
			this.Camera.RotateCamera(1)
			this.Visibility.UpdateSize()
		}
		if (this.hasJustBeenPressed(this.RotateLeftInput())) {
			this.Camera.RotateCamera(-1)
			this.Visibility.UpdateSize()
		}
	}

	private RotateRightInput() {
		return this.State.InputMode == InputMode.Camera
			? Input.CameraModeRotateCameraRight
			: Input.RotateCameraRight
	}

	private RotateLeftInput() {
		return this.State.InputMode == InputMode.Camera
			? Input.CameraModeRotateCameraLeft
			: Input.RotateCameraLeft
	}

	//////////////////////////////// NORMAL ////////////////////////////////
	private PreviousMovement = new Vector2(0, 0)

	private ParseMovement(player: Id) {
		const factor = this.boolStateFor(Input.HoldWalk) ? 0.5 : 1
		const up = this.floatStateFor(this.MoveUpInput()) ?? 0
		const down = this.floatStateFor(this.MoveDownInput()) ?? 0
		const left = this.floatStateFor(this.MoveLeftInput()) ?? 0
		const right = this.floatStateFor(this.MoveRightInput()) ?? 0

		const baseMovement = new Vector2(right - left, down - up).rotate(AngleOf(this.State.ViewDirection))
		const movement = baseMovement.lengthSquared() > 1
			? baseMovement.unitVector().multiply(factor)
			: baseMovement.multiply(factor)
		if (movement.x === this.PreviousMovement.x && movement.y === this.PreviousMovement.y)
			return null
		this.PreviousMovement = movement
		return new MovementAction(player, movement)
	}

	private ParseDash(player: Id) {
		//var angle = CurrentControllerType == ControllerType.KeyboardAndMouse
		//	? this.GetVectorToMouse(player).GetAngle()
		//	: this.Game.Entities.Orientation.Get.Of(player) ?? 0;

		const angle = this.GetVectorToMouse(player).getAngle()

		//if (HasJustBeenPressed(Input.Action))
		//	new ChargeDashAction(player, angle);
		if (this.hasJustBeenReleased(this.ActionInput()))
			return new ReleaseDashAction(player, angle)
		if (this.boolStateFor(this.ActionInput()))
			return new ChargeDashAction(player, angle)
		return null
	}

	private ParseUseItem(player: Id) {
		const position = this.Camera.TilePositionFor(
			this.displayProvider.getInputState("MouseX"),
			this.displayProvider.getInputState("MouseY"),
		)
		
		if (this.hasJustBeenPressed(this.UseItemInput()))
			return new UseItemAction(player, UseItemActionType.Start, position)
		if (this.hasJustBeenReleased(this.UseItemInput()))
			return new UseItemAction(player, UseItemActionType.End, position)
	}


	private ActionInput() {
		return this.State.InputMode == InputMode.Normal
			? Input.NormalModeAction
			: Input.Action
	}

	private UseItemInput() {
		return this.State.InputMode == InputMode.Normal
			? Input.NormalModeUseItem
			: Input.UseItem
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

	private MoveUpInput() {
		return this.State.InputMode == InputMode.Normal
			? Input.NormalModeMoveUp
			: Input.MoveUp
	}

	private MoveDownInput() {
		return this.State.InputMode == InputMode.Normal
			? Input.NormalModeMoveDown
			: Input.MoveDown
	}

	private MoveLeftInput() {
		return this.State.InputMode == InputMode.Normal
			? Input.NormalModeMoveLeft
			: Input.MoveLeft
	}

	private MoveRightInput() {
		return this.State.InputMode == InputMode.Normal
			? Input.NormalModeMoveRight
			: Input.MoveRight
	}

	//////////////////////////////// SELECTION ////////////////////////////////

	private ParseSelectItem(player: Id) {
		const selectableItems = this.Game.Entities.SelectableItems.Get.Of(player)
		if (!selectableItems)
			return null
		if (this.hasJustBeenPressed(Input.SelectNextItem))
			return new SelectItemAction(player, selectableItems.CurrentItemInSet + 1)
		if (this.hasJustBeenPressed(Input.SelectPreviousItem))
			return new SelectItemAction(player, selectableItems.CurrentItemInSet - 1)
		if (this.hasJustBeenPressed(this.SelectTopItemInput()))
			return new SelectItemAction(player, 0)
		if (this.hasJustBeenPressed(this.SelectRightItemInput()))
			return new SelectItemAction(player, 1)
		if (this.hasJustBeenPressed(this.SelectBottomItemInput()))
			return new SelectItemAction(player, 2)
		if (this.hasJustBeenPressed(this.SelectLeftItemInput()))
			return new SelectItemAction(player, 3)
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
