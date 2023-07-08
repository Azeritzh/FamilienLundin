import { BaseInputParser, DisplayProvider, Id } from "@lundin/age"
import { Vector2, Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { ActionState, ChargeDashAction, MovementAction, ReleaseDashAction, SelectItemAction, SelectToolAction, UseItemAction, UseToolAction } from "../../state/game-update"
import { AngleOf, DisplayState, InputMode } from "../state/display-state"
import { Camera } from "./camera"
import { Input } from "./input"
import { Visibility } from "./visibility"

export class InputParser extends BaseInputParser<Input> {

	constructor(
		private Game: Meld,
		private State: DisplayState,
		private Camera: Camera,
		private Visibility: Visibility,
		DisplayProvider: DisplayProvider,
		Inputs: Map<Input, string[]>,
	) {
		super(DisplayProvider, Inputs)
	}

	ParseInputs() {
		this.UpdateMode()
		this.UpdateCamera()
		this.UpdateActionStates()
		const player = this.Game.State.Players.get(this.State.PlayerName)
		return [
			this.ParseDash(player),
			this.ParseMovement(player),
			this.ParseUseItem(player),
			this.ParseUseTool(player),
			this.ParseSelectItem(player),
			this.ParseSelectTool(player),
		].filter(x => x)
	}

	private UpdateMode() {
		if (this.BoolStateFor(Input.HoldCamera))
			this.State.InputMode = InputMode.Camera
		else if (this.BoolStateFor(Input.HoldSelection))
			this.State.InputMode = InputMode.Selection
		else
			this.State.InputMode = InputMode.Normal
	}

	private GetVectorToMouse(player: Id) {
		const pointerVector = this.Camera.TilePositionFor(
			this.DisplayProvider.GetInputState("MouseX"),
			this.DisplayProvider.GetInputState("MouseY")
		).subtract(this.Game.Entities.Position.Get.Of(player) ?? new Vector3(0, 0, 0))
		return new Vector2(pointerVector.x, pointerVector.y)
	}

	//////////////////////////////// CAMERA ////////////////////////////////

	private UpdateCamera() {
		if (this.HasJustBeenPressed(this.RotateRightInput())) {
			this.Camera.RotateCamera(1)
			this.Visibility.UpdateSize()
		}
		if (this.HasJustBeenPressed(this.RotateLeftInput())) {
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
	private PreviousItemTarget = new Vector3(0, 0, 0)
	private PreviousToolTarget = new Vector3(0, 0, 0)

	private ParseMovement(player: Id) {
		const factor = this.BoolStateFor(Input.HoldWalk) ? 0.5 : 1
		const up = this.FloatStateFor(this.MoveUpInput()) ?? 0
		const down = this.FloatStateFor(this.MoveDownInput()) ?? 0
		const left = this.FloatStateFor(this.MoveLeftInput()) ?? 0
		const right = this.FloatStateFor(this.MoveRightInput()) ?? 0

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
		if (this.HasJustBeenReleased(this.ActionInput()))
			return new ReleaseDashAction(player, angle)
		if (this.BoolStateFor(this.ActionInput()))
			return new ChargeDashAction(player, angle)
		return null
	}

	private ParseUseItem(player: Id) {
		const target = this.Camera.TilePositionFor(
			this.DisplayProvider.GetInputState("MouseX"),
			this.DisplayProvider.GetInputState("MouseY"),
		)

		const targetHasChanged = !this.PreviousItemTarget.equals(target)
		this.PreviousItemTarget = target
		if (this.HasJustBeenPressed(this.UseItemInput()))
			return new UseItemAction(player, ActionState.Start, target)
		if (this.HasJustBeenReleased(this.UseItemInput()))
			return new UseItemAction(player, ActionState.End, target)
		if (this.BoolStateFor(this.UseItemInput()) && targetHasChanged)
			return new UseItemAction(player, ActionState.Unchanged, target)
		return null
	}

	private ParseUseTool(player: Id) {
		const target = this.Camera.TilePositionFor(
			this.DisplayProvider.GetInputState("MouseX"),
			this.DisplayProvider.GetInputState("MouseY"),
		)

		const targetHasChanged = !this.PreviousToolTarget.equals(target)
		this.PreviousToolTarget = target
		const primaryState = this.ActionStateFor(this.ToolPrimaryInput())
		const secondaryState = this.ActionStateFor(this.ToolSecondaryInput())

		if (primaryState !== ActionState.Unchanged || secondaryState !== ActionState.Unchanged || this.ShouldUpdateToolTarget(targetHasChanged))
			return new UseToolAction(player, primaryState, secondaryState, target)
		return null
	}

	private ActionStateFor(input: Input) {
		if (this.HasJustBeenPressed(input))
			return ActionState.Start
		if (this.HasJustBeenReleased(input))
			return ActionState.End
		return ActionState.Unchanged
	}

	private ShouldUpdateToolTarget(targetHasChanged: boolean) {
		return targetHasChanged && (this.BoolStateFor(this.ToolPrimaryInput()) || this.BoolStateFor(this.ToolSecondaryInput()))
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
		if (this.HasJustBeenPressed(Input.SelectNextItem))
			return new SelectItemAction(player, selectableItems.CurrentItemInSet + 1)
		if (this.HasJustBeenPressed(Input.SelectPreviousItem))
			return new SelectItemAction(player, selectableItems.CurrentItemInSet - 1)
		if (this.HasJustBeenPressed(this.SelectTopItemInput()))
			return new SelectItemAction(player, 0)
		if (this.HasJustBeenPressed(this.SelectRightItemInput()))
			return new SelectItemAction(player, 1)
		if (this.HasJustBeenPressed(this.SelectBottomItemInput()))
			return new SelectItemAction(player, 2)
		if (this.HasJustBeenPressed(this.SelectLeftItemInput()))
			return new SelectItemAction(player, 3)
	}

	private ParseSelectTool(player: Id) {
		if (this.HasJustBeenPressed(this.SelectTopToolInput()))
			return new SelectToolAction(player, 0)
		if (this.HasJustBeenPressed(this.SelectRightToolInput()))
			return new SelectToolAction(player, 1)
		if (this.HasJustBeenPressed(this.SelectBottomToolInput()))
			return new SelectToolAction(player, 2)
		if (this.HasJustBeenPressed(this.SelectLeftToolInput()))
			return new SelectToolAction(player, 3)
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
